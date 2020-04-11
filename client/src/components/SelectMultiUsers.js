import React from 'react';
import { Query } from 'react-apollo';
import { Dropdown } from 'semantic-ui-react';
import { getTeamMembersQuery } from '../graphql/team';


const SelectMultiUsers = ({ teamId, placeholder, handleChange, value }) => (
    <Query query={getTeamMembersQuery} variables={{teamId: parseInt(teamId)}}>
        {
            ({ loading, error, data: { getTeamMembers } }) => {
                if (loading) return null;
                return (
                    <Dropdown
                        placeholder={placeholder}
                        value={value}
                        onChange={handleChange}
                        fluid
                        multiple
                        search
                        selection
                        options={getTeamMembers.map(tm => ({ key: tm.id, value: tm.id, text: tm.username }))}/>
                )
            }
        }
    </Query>
)


export default SelectMultiUsers;