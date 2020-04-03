import React, { Component } from 'react';
import decode from 'jwt-decode';

import Teams from '../components/Teams'
import Channels from '../components/Channels'
import AddChannelModal from '../components/AddChannelModal';
import InvitePeopleModal from '../components/InvitePeopleModal';



class Sidebar extends Component {

    state = {
        openAddChannelModal: false,
        openInvitePeopleModal: false,
    };

    handleCloseAddChannelModal = () => {
        this.setState({ openAddChannelModal: false })
    }

    handleAddChannelClick = () => {
        this.setState({ openAddChannelModal: true })
    }

    handleCloseInvitePeopleModal = () => {
        this.setState({ openInvitePeopleModal: false });
    }

    handleInvitePeopleClick = () => {
        this.setState({ openInvitePeopleModal: true });
    }

    render() {
        const { team, teams } = this.props

        let username = "";
        
        try {
            const token = localStorage.getItem('token');
            const { user } = decode(token);
            username = user.username;
        } catch(err) {
            console.log(err);
        }
        
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
                    users={[{id:1, name: "SlackBot"}, {id:2, name: "User"}]}
                    onAddChannelClick={this.handleAddChannelClick}
                    onInvitePeopleClick={this.handleInvitePeopleClick}
                />

                <AddChannelModal
                    key='sidebar-add-channel-modal'
                    teamId={team.id}
                    open={this.state.openAddChannelModal}
                    onClose={this.handleCloseAddChannelModal}/>
                
                <InvitePeopleModal
                    key='invite-people-modal'
                    teamId={team.id}
                    open={this.state.openInvitePeopleModal}
                    onClose={this.handleCloseInvitePeopleModal}/>
            </>
        );
    }
}


export default Sidebar;