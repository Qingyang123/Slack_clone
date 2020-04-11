import gql from 'graphql-tag';

export const meQuery = gql`
    query {
        me {
            id
            username
            teams {
                id
                name
                owner
                directMessageMembers {
                    id
                    username
                }
                channels {
                    id
                    name
                }
            }
        }
    }
`;


export const getTeamMembersQuery = gql`
    query ($teamId: Int! ){
        getTeamMembers(teamId: $teamId) {
            username
            id
        }
    }
`;
