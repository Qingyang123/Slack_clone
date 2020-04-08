import React from 'react';
import { withRouter } from 'react-router-dom';
import Downshift from 'downshift';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import { Form, Button, Modal, Input, List } from 'semantic-ui-react';


const DirectMessageModal = ({
    history,
    open, 
    onClose, 
    teamId,
    data: { loading, getTeamMembers }
}) => (
    <Modal open={open} onClose={onClose}>
        <Modal.Header>Add channel</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    { !loading && (<Downshift
                        onChange={selectedUser => {
                            console.log(selectedUser);
                            history.push(`/view-team/user/${teamId}/${selectedUser.id}`)
                        }}
                        itemToString={item => (item ? item.username : '')}>
                            {({
                                getInputProps,
                                getItemProps,
                                getMenuProps,
                                isOpen,
                                inputValue,
                                highlightedIndex,
                                selectedItem,
                            }) => (
                            <div>
                                <Input {...getInputProps({placeholder: "Search users"})} fluid />
                                <List {...getMenuProps()}>

                                {isOpen
                                    ? getTeamMembers
                                        .filter(item => !inputValue || item.username.toLowerCase().includes(inputValue.toLowerCase()))
                                        .map((item, index) => (
                                            <List.Item
                                                {...getItemProps({
                                                    key: item.username,
                                                    index,
                                                    item,
                                                    style: {
                                                        backgroundColor: highlightedIndex === index ? 'lightgray' : null,
                                                        fontWeight: selectedItem === item ? 'bold' : 'normal',
                                                    },
                                                })}
                                            >
                                                {item.username}
                                            </List.Item>
                                        ))
                                    : null}
                                </List>
                            </div>
                            )}
                        </Downshift>
                    ) }
                </Form.Field>
                <Form.Group>
                    <Button fluid onClick={onClose}>Cancel</Button>
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const getTeamMembersQuery = gql`
    query ($teamId: Int! ){
        getTeamMembers(teamId: $teamId) {
            username
            id
        }
    }
`;

export default withRouter(graphql(getTeamMembersQuery)(DirectMessageModal));