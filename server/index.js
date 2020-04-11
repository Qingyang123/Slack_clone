import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { createServer } from 'http';
import formidable from 'formidable';


import models from './models';
import { refreshTokens } from './auth';


const PORT = 4000;
const SECRET = "a string that you would never be able to guess";
const SECRET2 = "another string, just used for refreshing"

const app = express();
app.use(cors('*'));

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
        } catch (err) {
            const refreshToken = req.headers['x-refresh-token'];
            const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
            if (newTokens.token && newTokens.refreshToken) {
                res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
                res.set('x-token', newTokens.token);
                res.set('x-refresh-token', newTokens.refreshToken);
            }
            req.user = newTokens.user;
        }
    }
    next();
};


const uploadDir = 'files';

const fileMiddleware = (req, res, next) => {
    if (!req.is('multipart/form-data')) {
        return next();
    }

    const form = formidable.IncomingForm({
        uploadDir,
    });

    form.parse(req, (error, { operations }, files) => {
        if (error) {
        console.log(error);
        }

        const document = JSON.parse(operations);

        if (Object.keys(files).length) {
            const { file: { type, path: filePath } } = files;
            console.log(type);
            console.log(filePath);
            document.variables.file = {
                type,
                path: filePath,
            };
        }

        req.body = document;
        next();
    });
};

app.use(addUser);

  

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req, connection }) => ({
        models,
        user: connection ? connection.context.user : req.user,
        SECRET,
        SECRET2
    }),
    uploads: {
        // Limits here should be stricter than config for surrounding
        // infrastructure such as Nginx so errors can be handled elegantly by
        // graphql-upload:
        // https://github.com/jaydenseric/graphql-upload#type-processrequestoptions
        maxFileSize: 10000000, // 10 MB
        maxFiles: 1
    },
    subscriptions: {
        onConnect: async(connectionParams, webSocket, context) => {
            const { token, refreshToken } = connectionParams;

            if (token && refreshToken) {
                let user = null;
                try {
                    const { user } = jwt.verify(token, SECRET);
                    return { models, user };
                } catch(err) {
                    const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
                    return { models, user: newTokens.user };
                }

                // const member = await models.Member.findOne({ where: { teamId: 1, userId: user.id } });

                // if (!member) {
                //     throw new Error('Missing auth tokens!');
                // }
            }
            return { models }
        }
    },
});

app.use(fileMiddleware);

server.applyMiddleware({ app, fileMiddleware });
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

// { force: true }
models.sequelize.sync().then(function () {
    // app.listen(PORT);
    // console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
    httpServer.listen(PORT, () => {
        console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
        console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    })
}); 