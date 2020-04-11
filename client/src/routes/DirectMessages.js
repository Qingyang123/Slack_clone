import React from 'react';
import { Redirect } from 'react-router-dom';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import * as compose from 'lodash/flowRight';
import findIndex from 'lodash/findIndex';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import DirectMessageContainer from '../containers/DirectMessageContainer';

import { meQuery } from '../graphql/team';

// { data: { loading, me }, match: { params: { teamId, userId } } }
const DirectMessages = ({ mutate, data: { loading, me, getUser }, match: { params: { teamId, userId } } }) => {

    if (loading) return null;
    console.log(me);
    const { teams, username, id } = me;
    if (teams.length === 0) return <Redirect to='/create-team'/>

    const teamIdInteger = parseInt(teamId, 10);
    const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
    const team = teamIdx === -1 ? teams[0] : teams[teamIdx];

    return (
        <AppLayout>
            <Sidebar
                username={username}
                userId={id}
                team={team}
                teams={teams.map(t => ({
                    id: t.id,
                    letter: t.name.charAt(0).toUpperCase()
                }))}/>
            <Header channelName={getUser.username} />
            <DirectMessageContainer teamId={team.id} otherUserId={userId}/>
            <SendMessage placeholder={userId} onSubmit={async (text) => {
                const res = await mutate({
                    variables: {
                        text,
                        receiverId: parseInt(userId),
                        teamId: teamIdInteger
                    },
                    optimisticResponse: {
                        createDirectMessage: true,
                    },
                    update: (store) => {
                            const data = store.readQuery({ query: meQuery });
                            const teamIdx2 = findIndex(data.me.teams, ['id', team.id]);
                            const notAlreadyThere = data.me.teams[teamIdx2].directMessageMembers.every(member => member.id !== parseInt(userId))
                            if (notAlreadyThere) {
                                data.me.teams[teamIdx2].directMessageMembers.push({
                                    __typename: 'User',
                                    id: parseInt(userId),
                                    username: getUser.username
                                });
                                store.writeQuery({ query: meQuery, data })
                            }
                    }
                })
                
            }}/>
        </AppLayout>
    );
};



const createDirectMessageMutation = gql`
    mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
        createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
    }
`;

const directMessageMeQuery = gql`
    query($userId: Int!) {
        getUser(userId: $userId) {
            username
        }
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

export default compose(
    graphql(directMessageMeQuery, {
        options: props => ({
            fetchPolicy: 'network-only',
            variables: { userId: parseInt(props.match.params.userId) }
        })
    }),
    graphql(createDirectMessageMutation),
)(DirectMessages);