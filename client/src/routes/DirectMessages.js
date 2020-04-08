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
const DirectMessages = ({ mutate, data: { loading, me }, match: { params: { teamId, userId } } }) => {
    // console.log(props);
    // const { loading, me } = props.data;
    // const { teamId, userId } = props.match.params;
    if (loading) return null;
    // console.log(me);
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
            <Header channelName={'username'} />
            <DirectMessageContainer teamId={teamId} otherUserId={userId}/>
            <SendMessage placeholder={userId} onSubmit={async (text) => {
                console.log('here');
                const res = await mutate({
                    variables: {
                        text,
                        receiverId: parseInt(userId),
                        teamId: teamIdInteger
                    }
                })
                console.log(res);
            }}/>
        </AppLayout>
    );
};



const createDirectMessageMutation = gql`
    mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
        createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
    }
`;

export default compose(
    graphql(meQuery, {options: {fetchPolicy: 'network-only'}}),
    graphql(createDirectMessageMutation),
)(DirectMessages);