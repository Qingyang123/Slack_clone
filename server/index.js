import express from 'express';
import path from 'path';
import { ApolloServer } from 'apollo-server-express';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';


const PORT = 4000;

const app = express();

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')), { all: true });
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: {
        models,
        user: {
            id: 1
        }
    }
});

server.applyMiddleware({ app });


models.sequelize.sync().then(function () {
    app.listen(PORT);
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}); 