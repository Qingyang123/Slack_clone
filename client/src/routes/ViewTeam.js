import React from 'react';
import { Redirect } from 'react-router-dom';
import { graphql } from 'react-apollo';
import findIndex from 'lodash/findIndex';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar';
import MessageContainer from '../containers/MessageContainer';

import { meQuery } from '../graphql/team';

// { loading, me }
const ViewTeam = ({ data: { loading, me }, match: { params: { teamId, channelId } } }) => {
    if (loading) return null;

    console.log(me);
    const { teams, username, id } = me;
    if (teams.length === 0) return <Redirect to='/create-team'/>

    const teamIdInteger = parseInt(teamId, 10);
    const teamIdx = teamIdInteger ? findIndex(teams, ['id', teamIdInteger]) : 0;
    const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
    console.log(team);
    const channelIdInteger = parseInt(channelId, 10);
    const channelIdx = channelIdInteger ? findIndex(team.channels, ['id', channelIdInteger]) : 0;
    const channel = channelIdx === -1 ? team.channels[0] : team.channels[channelIdx];
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
            {channel && <Header channelName={channel.name} />}
            {channel && (
                <MessageContainer channelId={channel.id}/>
            )}
            {channel && <SendMessage channelName={channel.name} channelId={channel.id} />}
        </AppLayout>
    );
};

export default graphql(meQuery, {options: {fetchPolicy: 'network-only'}})(ViewTeam);