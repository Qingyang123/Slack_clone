import React from 'react';
import styled from 'styled-components';
import { Input } from 'semantic-ui-react';
import { withFormik } from 'formik';


const SendMessageWrapper = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
`

const ENTER_KEY = 13;

const SendMessage = ({
    placeholder,
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