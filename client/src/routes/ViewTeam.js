import React from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar'


const ViewTeam = ({ match: { params } }) => (
    <AppLayout>
        <Sidebar currentTeamId={params.teamId}/>
        <Header channelName="general" />
        <Messages/>
        <SendMessage channelName="general"/>
    </AppLayout>
);

export default ViewTeam;