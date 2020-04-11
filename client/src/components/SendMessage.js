import React from 'react';
import styled from 'styled-components';
import { Input, Button, Icon } from 'semantic-ui-react';
import { withFormik } from 'formik';
import FileUpload from './FileUpload';


const SendMessageWrapper = styled.div`
    grid-column: 3;
    margin: 20px;
    display: grid;
    grid-template-columns: 4% auto;
`

const ENTER_KEY = 13;

const SendMessage = ({
    placeholder,
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    channelId
}) => (
    <SendMessageWrapper>
        <FileUpload channelId={channelId}>
            <Button icon>
                <Icon name="plus"/>
            </Button>
        </FileUpload>
        <Input 
            name='message' 
            value={values.message} 
            placeholder={`Message #${placeholder}`}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={(e) => {
                if(e.keyCode === ENTER_KEY && !isSubmitting) {
                    handleSubmit(e);
                }
            }}/>
    </SendMessageWrapper>
);

export default withFormik({
        mapPropsToValues: () => ({ message: '' }),
        handleSubmit: async (values, { props: { onSubmit }, resetForm, setSubmitting }) => {
            if (!values.message || !values.message.trim()) {
                setSubmitting(false);
                return
            }

            await onSubmit(values.message);
            resetForm(false);
        }
    })(SendMessage);