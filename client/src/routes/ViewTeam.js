import React from 'react';
import AppLayout from '../components/AppLayout';
import Header from '../components/Header';
import Messages from '../components/Messages';
import SendMessage from '../components/SendMessage';
import Sidebar from '../containers/Sidebar'


export default () => (
    <AppLayout>
        <Sidebar currentTeamId={6}/>
        <Header channelName="general" />
        <Messages/>
        <SendMessage channelName="general"/>
    </AppLayout>
);