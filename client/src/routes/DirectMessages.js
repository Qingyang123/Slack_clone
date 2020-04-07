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
import MessageContainer from '../containers/MessageContainer';

import { meQuery } from '../graphql/team';

// { loading, me }
const DirectMessages = ({ data: { loading, me }, match: { params: { teamId, userId } } }) => {
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
            {/* <Header channelName={channel.name} />
            <MessageContainer channelId={channel.id}/> */}
            <SendMessage onSubmit={() => {}} placeholder={userId} />
        </AppLayout>
    );
};



const createMessageMutation = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text)
    }
`;

export default compose(
    graphql(meQuery, {options: {fetchPolicy: 'network-only'}}),
    graphql(createMessageMutation),
)(DirectMessages);