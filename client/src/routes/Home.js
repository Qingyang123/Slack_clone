import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const Home = ({ data: { loading, allUsers } }) => {
    return loading ? null : (
        allUsers.map(user => <h1 key={user.id}>{user.username}</h1>)
    )
}

const allUsersQuery = gql`
    {
        allUsers {
            id
            username
        }
    }
`;


export default graphql(allUsersQuery)(Home);