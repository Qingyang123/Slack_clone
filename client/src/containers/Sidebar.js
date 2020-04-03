import React, { Component } from 'react';
import findIndex from 'lodash/findIndex';
import decode from 'jwt-decode';
import { Query } from 'react-apollo';

import Teams from '../components/Teams'
import Channels from '../components/Channels'
import AddChannelModal from '../components/AddChannelModal';
import { allTeamsQuery } from '../graphql/team';


class Sidebar extends Component {

    state = {
        openAddChannelModal: false
    };

    handleCloseAddChannelModal = () => {
        this.setState({ openAddChannelModal: false })
    }

    handleAddChannelClick = () => {
        this.setState({ openAddChannelModal: true })
    }

    render() {
        const { currentTeamId } = this.props

        return(
            <Query query={allTeamsQuery}>
                {
                    (props) => {
                        const { loading, error, data } = props;
                        if (loading) return null;
                        if (error) return null;
                        
                        if (data) {
                            const teamIdx = currentTeamId ? findIndex(data.allTeams,['id', parseInt(currentTeamId, 10)]) : 0;
                            const team = data.allTeams[teamIdx]
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
                                        teams={data.allTeams.map(team => ({
                                            id: team.id,
                                            name: team.name.charAt(0).toUpperCase()
                                        }))}/>
                                    <Channels
                                        key='channels-sidebar'
                                        teamName={team.name}
                                        username={username}
                                        teamId={team.id}
                                        channels={team.channels}
                                        users={[{id:1, name: "SlackBot"}, {id:2, name: "User"}]}
                                        onAddChannelClick={this.handleAddChannelClick}
                                    />

                                    <AddChannelModal
                                        key='sidebar-add-channel-modal'
                                        teamId={team.id}
                                        open={this.state.openAddChannelModal}
                                        onClose={this.handleCloseAddChannelModal}/>
                                </>
                            );
                        }
                    }
                }
            </Query>
        );
    }
}


export default Sidebar;