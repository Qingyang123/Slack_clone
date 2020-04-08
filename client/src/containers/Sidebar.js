import React, { Component } from 'react';
import decode from 'jwt-decode';

import Teams from '../components/Teams'
import Channels from '../components/Channels'
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';
import DirectMessageModal from '../components/DirectMessageModal';


class Sidebar extends Component {

    state = {
        openAddChannelModal: false,
        openInvitePeopleModal: false,
        openDirectMessageModal: false,
    };

    toggleAddChannelModal = (e) => {
        if (e) e.preventDefault();
        this.setState(prevState => ({
            openAddChannelModal: !prevState.openAddChannelModal
        }))
    }

    toggleInvitePeopleClick = (e) => {
        if (e) e.preventDefault();
        this.setState(prevState => ({
            openInvitePeopleModal: !prevState.openInvitePeopleModal
        }))
    }

    toggleDirectMessageModal = (e) => {
        if (e) e.preventDefault();
        this.setState(prevState => ({
            openDirectMessageModal: !prevState.openDirectMessageModal
        }))
    }

    render() {
        const { team, teams, username, userId } = this.props
        // console.log('team: ', team);
        // console.log('userId: ', userId);
        return (
            <>
                <Teams 
                    key='team-sidebar'
                    teams={teams}/>
                <Channels
                    key='channels-sidebar'
                    teamName={team.name}
                    username={username}
                    teamId={team.id}
                    channels={team.channels}
                    isOwner={userId === team.owner}
                    users={[{id:1, name: "SlackBot"}, {id:2, name: "User"}]}
                    onAddChannelClick={this.toggleAddChannelModal}
                    onInvitePeopleClick={this.toggleInvitePeopleClick}
                    onDirectMessageClick={this.toggleDirectMessageModal}
                />

                <AddChannelModal
                    key='sidebar-add-channel-modal'
                    teamId={team.id}
                    open={this.state.openAddChannelModal}
                    onClose={this.toggleAddChannelModal}/>
                
                <DirectMessageModal
                    key='sidebar-direct-message-modal'
                    teamId={team.id}
                    open={this.state.openDirectMessageModal}
                    onClose={this.toggleDirectMessageModal}/>

                <InvitePeopleModal
                    key='invite-people-modal'
                    teamId={team.id}
                    open={this.state.openInvitePeopleModal}
                    onClose={this.toggleInvitePeopleClick}/>
            </>
        );
    }
}


export default Sidebar;