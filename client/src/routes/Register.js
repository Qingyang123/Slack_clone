import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Header, Form, Button } from 'semantic-ui-react';

class Register extends Component {
    state = {
        username: '',
        usernameError: '',
        email: '',
        emailError: '',
        password: '',
        passwordError: ''
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async () => {
        this.setState({
            usernameError:"",
            emailError: "",
            passwordError: "",
        })
        const { username, email, password } = this.state;
        const res = await this.props.mutate({
            variables: { username, email, password }
        })

        const { ok, errors } = res.data.register;
        if (ok) {
            this.props.history.push('/login');
        } else {
            const err = {};
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            })
            this.setState(err);
        }
        console.log(res);
    }

    render() {

        const { username, email, password, usernameError, emailError, passwordError } = this.state

        let errorList = {
            usernameError: null,
            emailError: null,
            passwordError: null
        };

        if(usernameError) {
            errorList['usernameError'] = usernameError
        }
        if(emailError) {
            errorList['emailError'] = emailError
        }
        if(passwordError) {
            errorList['passwordError'] = passwordError
        }

        return (
            <Container text>
                <Header as="h2">Register</Header>
                <Form>
                    <Form.Input error={errorList['usernameError']} name='username' value={username} onChange={this.onChange} label='Username' placeholder='Username' fluid />
                    <Form.Input error={errorList['emailError']} name='email' value={email} onChange={this.onChange} label='Email' placeholder='Email' fluid />
                    <Form.Input error={errorList['passwordError']} name='password' value={password} onChange={this.onChange} label='Password' placeholder='Password' type='password' fluid />
                    <Button onClick={this.onSubmit} primary>Submit</Button>
                </Form>
            </Container>
        )
    }
}

const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password) {
            ok
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(registerMutation)(Register);