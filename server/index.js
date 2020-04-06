import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import { createServer } from 'http';


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

app.use(addUser);

  

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: ({ req, connection }) => ({
        models,
        user: connection ? connection.context : req.user,
        SECRET,
        SECRET2
    }),
    subscriptions: {
        onConnect: async(connectionParams, webSocket, context) => {
            console.log('connectionParams: ', connectionParams);
            const { token, refreshToken } = connectionParams;

            if (token && refreshToken) {
                let user = null;
                try {
                    console.log('try block')
                    const decoded = jwt.verify(token, SECRET);
                    user = decoded.user;
                    console.log('after decode')
                    console.log(user);
                } catch(err) {
                    console.log('inside catch')
                    console.log('token: ', token, refreshToken)
                    console.log('refresh: ', refreshToken)
                    const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
                    console.log('new tokens: ', newTokens);
                    user = newTokens.user;
                    console.log(user);
                }

                if (!user) {
                    console.log('catch error');
                    throw new Error('Invalid auth tokens');
                }
                // const member = await models.Member.findOne({ where: { teamId: 1, userId: user.id } });

                // if (!member) {
                //     throw new Error('Missing auth tokens!');
                // }
                return true;
            }
            throw new Error ('Missing auth tokens')
        }
    },
});

server.applyMiddleware({ app });
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