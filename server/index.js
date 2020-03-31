import express from 'express';
import path from 'path';
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';


const PORT = 4000;
const SECRET = "a string that you would never be able to guess";
const SECRET2 = "another string, just used for refreshing"

const app = express();
app.use(cors('*'));

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: {
        models,
        user: {
            id: 1
        },
        SECRET,
        SECRET2
    }
});

server.applyMiddleware({ app });


models.sequelize.sync().then(function () {
    app.listen(PORT);
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}); 