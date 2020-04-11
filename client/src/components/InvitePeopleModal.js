import React from 'react';
import { withFormik } from 'formik';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as compose from 'lodash/flowRight';
import { Message, Form, Button, Modal, Input } from 'semantic-ui-react';
import normalizeErrors from '../normalizeErrors';

const InvitePeopleModal = ({
    open, 
    onClose, 
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    touched,
    errors,
    resetForm
}) => (
    <Modal open={open} onClose={onClose}>
        <Modal.Header>Add people to your team</Modal.Header>
        <Modal.Content>
            <Form>
                <Form.Field>
                    <Input 
                        fluid
                        name='email'
                        placeholder='Users email'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}/>
                </Form.Field>
                {
                    
                    ((!!touched.email && errors)) && (
                        <Message negative>
                            <Message.Header>{errors.message}</Message.Header>
                        </Message>
                    )
                    
                }
                <Form.Group widths='equal'>
                    <Button fluid type='submit' disabled={isSubmitting} onClick={handleSubmit}>Add User</Button>
                    <Button fluid disabled={isSubmitting} onClick={onClose}>Cancel</Button>
                </Form.Group>
            </Form>
            
        </Modal.Content>
    </Modal>
)

const addTeamMemberMutation = gql`
    mutation($email: String!, $teamId: Int!) {
        addTeamMember(email: $email, teamId: $teamId) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default compose(
    graphql(addTeamMemberMutation),
    withFormik({
        mapPropsToValues: () => ({ email: '' }),
        handleSubmit: async (values, { props: { onClose, teamId, mutate }, setSubmitting, setErrors }) => {

            const res = await mutate({
                variables: { teamId: parseInt(teamId, 10), email: values.email },
            });

            const { ok, errors } = res.data.addTeamMember;
            console.log(ok, errors);
            if (ok) {
                setSubmitting(false);
                onClose();
            } else {
                setSubmitting(false);
                setErrors(normalizeErrors(errors));
                
            }
        }
    })
)(InvitePeopleModal);
