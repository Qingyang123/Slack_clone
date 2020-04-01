import React from 'react';
import gql from 'graphql-tag';
import _ from 'lodash';
import decode from 'jwt-decode';
import { Query } from 'react-apollo';

import Teams from '../components/Teams'
import Channels from '../components/Channels'

const allTeamsQuery = gql`
    query {
        allTeams {
            id
            name
            channels {
                id
                name
            }
        }
    }
`;

const Sidebar = ({ currentTeamId }) => (
    <Query query={allTeamsQuery}>
        {
            (props) => {
                const { loading, error, data } = props;
                console.log(props);
                console.log(loading, data, error);
                if (loading) return null;
                if (error) return null;
                
                if (data) {
                    console.log('here');
                    console.log(data);
                    const teamIdx = _.findIndex(data.allTeams,['id', currentTeamId])
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
                            <Teams teams={data.allTeams.map(team => ({
                                id: team.id,
                                name: team.name.charAt(0).toUpperCase()
                            }))}/>
                            <Channels
                                teamName={team.name}
                                username={username}
                                channels={team.channels}
                                users={[{id:1, name: "SlackBot"}, {id:2, name: "User"}]}
                            />
                        </>
                    );
                }
            }
        }
    </Query>
);


export default Sidebar