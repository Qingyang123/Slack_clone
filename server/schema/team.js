const { gql } = require('apollo-server-express');

export default gql`
    type Team {
        id: Int!
        name: String!
        owner: Int!
        members: [User!]!
        channels: [Channel!]!
    }

    type Query {
        allTeams: [Team!]!
        invitedTeams: [Team!]!
    }

    type CreateTeamResponse {
        ok: Boolean!
        team: Team
        errors: [Error!]
    }

    type VoidResponse {
        ok: Boolean!
        errors: [Error!]
    }

    type Mutation {
        createTeam(name: String!): CreateTeamResponse!
        addTeamMember(email: String!, teamId: Int!): VoidResponse!
    }
`;