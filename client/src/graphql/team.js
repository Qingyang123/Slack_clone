import gql from 'graphql-tag';

export const allTeamsQuery = gql`
    query {
        allTeams {
            id
            name
            owner
            channels {
                id
                name
            }
        }
        invitedTeams {
            id
            name
            owner
            channels {
                id
                name
            }
        }
    }
`;