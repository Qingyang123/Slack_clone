import React from 'react';
import { withFormik } from 'formik';
import findIndex from 'lodash/findIndex'
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as compose from 'lodash/flowRight';
import { Form, Button, Modal, Input } from 'semantic-ui-react';
import { meQuery } from '../graphql/team';

const AddChannelModal = ({
    open, 
    onClose, 
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    resetForm,
}) => (
    <Modal open={open} onClose={(e) => {
        resetForm();
        onClose(e);
    }}>
        <Modal.Header>Add channel</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <Input 
                        fluid
                        name='name'
                        placeholder='Channel name'
                        value={values.name}
                        onChange={handleChange}
                        onBlur={handleBlur}/>
                </Form.Field>
                <Form.Group>
                    <Button fluid type='submit' disabled={isSubmitting} onClick={handleSubmit}>Add Channel</Button>
                    <Button fluid disabled={isSubmitting} onClick={() => {
                        resetForm();
                        onClose();
                    }}>Cancel</Button>
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const createChannelMutation = gql`
    mutation($teamId: Int!, $name: String!) {
        createChannel(teamId: $teamId, name: $name) {
            ok
            channel {
                id
                name
            }
        }
    }
`;

export default compose(
    graphql(createChannelMutation),
    withFormik({
        mapPropsToValues: () => ({ name: '' }),
        handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => {
            await mutate({
                variables: { teamId: parseInt(teamId, 10), name: values.name },
                optimisticResponse: {
                    __typename: "Mutation",
                    createChannel: {
                        ok: true,
                        channel: {
                            __typename: "Channel",
                            id: -1,
                            name: values.name
                        },
                        __typename: "ChannelResponse"

                    }
                },
                update: (store, { data: { createChannel } }) => {
                    const { ok, channel } = createChannel;
                    if (ok) {
                        const data = store.readQuery({ query: meQuery });
                        const teamIdx = findIndex(data.me.teams, ['id', teamId]);
                        data.me.teams[teamIdx].channels.push(channel);
                        store.writeQuery({ query: meQuery, data })
                    } else {
                        return
                    }
                }
            });
            setSubmitting(false);
            onClose();
        }
    })
)(AddChannelModal);
