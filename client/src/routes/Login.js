import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Header, Form, Button } from 'semantic-ui-react';

class Login extends Component{
    constructor(props) {
        super(props);

        extendObservable(this, {
            email: '',
            password: '',
            errors: {}
        });
    }

    onChange = (e) => {
        this[e.target.name] = e.target.value;
    }

    onSubmit = async () => {
        const { email, password } = this;
        const res = await this.props.mutate({
            variables: { email, password }
        });
        console.log(res);

        const { ok, token, refreshToken, errors } = res.data.login;
        if (ok) {
            localStorage.setItem('token', token);
            localStorage.setItem('refreshToken', refreshToken);
            this.props.history.push('/');
        } else {
            const err = {}
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            })
            this.errors = err;
        }
    }

    render() {

        const { email, password, errors } = this;
        return (
            <Container text>
                <Header as="h2">Login</Header>
                <Form>
                    <Form.Input 
                        error={errors['emailError']}
                        name='email' 
                        value={email} 
                        onChange={this.onChange} 
                        label='Email' 
                        placeholder='Email' 
                        fluid />
                    <Form.Input 
                        error={errors['passwordError']}
                        name='password' 
                        value={password} 
                        onChange={this.onChange} 
                        label='Password' 
                        placeholder='Password' 
                        type='password' 
                        fluid />
                    <Button onClick={this.onSubmit} primary>Submit</Button>
                </Form>
            </Container>
        );
    }
}

const loginMutation = gql`
    mutation($email: String!, $password: String!) {
        login(email: $email, password:$password) {
            ok
            token
            refreshToken
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(loginMutation)(observer(Login));