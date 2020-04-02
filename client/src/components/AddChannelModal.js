import React from 'react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as compose from 'lodash/flowRight';
import { Form, Button, Modal, Input } from 'semantic-ui-react';

const AddChannelModal = ({
    open, 
    onClose, 
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
}) => (
    <Modal open={open} onClose={onClose}>
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
                    <Button fluid disabled={isSubmitting} onClick={onClose}>Cancel</Button>
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const createChannelMutation = gql`
    mutation($teamId: Int!, $name: String!) {
        createChannel(teamId: $teamId, name: $name)
    }
`;

export default compose(
    graphql(createChannelMutation),
    withFormik({
        mapPropsToValues: () => ({ name: '' }),
        handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting }) => {
            await mutate({ variables: { teamId: parseInt(teamId, 10), name: values.name }} );
            setSubmitting(false);
            onClose();
        }
    })
)(AddChannelModal);
