import React from 'react';
import styled from 'styled-components';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import * as compose from 'lodash/flowRight';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';


const SendMessageWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
`

const ENTER_KEY = 13;

const SendMessage = ({
    channelName,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting
}) => (
    <SendMessageWrapper>
        <Input 
            fluid 
            name='message' 
            value={values.message} 
            placeholder={`Message #${channelName}`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if(e.keyCode === ENTER_KEY && !isSubmitting) {
                    handleSubmit(e);
                }
            }}/>
    </SendMessageWrapper>
);

const createMessageMutation = gql`
    mutation($channelId: Int!, $text: String!) {
        createMessage(channelId: $channelId, text: $text)
    }
`;

export default compose(
    graphql(createMessageMutation),
    withFormik({
        mapPropsToValues: () => ({ message: '' }),
        handleSubmit: async (values, { props: { channelId, mutate }, resetForm, setSubmitting }) => {
            if (!values.message || !values.message.trim()) {
                setSubmitting(false);
                return
            }
            await mutate({
                variables: {
                    channelId,
                    text: values.message
                }
            });
            resetForm(false);
        }
    })
)(SendMessage);