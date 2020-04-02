const { gql } = require('apollo-server-express');

export default gql`
    type Team {
        id: Int!
        name: String!
        owner: User!
        members: [User!]!
        channels: [Channel!]!
    }

    type Query {
        allTeams: [Team!]!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
    }
`;