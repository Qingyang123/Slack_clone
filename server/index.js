import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';
import { refreshTokens } from './auth';


const PORT = 4000;
const SECRET = "a string that you would never be able to guess";
const SECRET2 = "another string, just used for refreshing"

const app = express();
app.use(cors('*'));

const addUser = async (req, res, next) => {
    const token = req.headers['x-token'];
    console.log('token: ', token);
    if (token) {
        try {
            const { user } = jwt.verify(token, SECRET);
            req.user = user;
            console.log('user: ', req.user);
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
    context: ({ req }) => ({
        models,
        user: req.user,
        SECRET,
        SECRET2
    })
});

server.applyMiddleware({ app });


models.sequelize.sync().then(function () {
    app.listen(PORT);
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}); 