import express from 'express';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';


const PORT = 4000;

const app = express();

const server = new ApolloServer({ typeDefs, resolvers });

server.applyMiddleware({ app });

// app.listen({ port: PORT }, () => {
//     console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
// });

models.sequelize.sync({ force: true }).then(function () {
    app.listen(PORT);
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
}); 