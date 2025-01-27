const { gql } = require('apollo-server-express');


export default gql`
    type Message {
        id: Int!
        text: String!
        user: User!
        channel: Channel!
        createdAt: String!
        url: String
        filetype: String
    }

    input File {
        type: String!
        path: String!
    }

    type Subscription {
        newChannelMessage(channelId: Int!): Message!
    }

    type Query {
        messages(channelId: Int!, offset: Int!): [Message]!
    }

    type Mutation {
        createMessage(channelId: Int!, text: String, file: Upload): Boolean!
    }
`;