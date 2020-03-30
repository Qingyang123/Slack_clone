import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Header, Input, Button } from 'semantic-ui-react';

class Register extends Component {
    state = {
        username: '',
        email: '',
        password: ''
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onSubmit = async () => {
        console.log(this.state);
        const res = await this.props.mutate({
            variables: this.state
        })
        console.log(res);
    }

    render() {

        const { username, email, password } = this.state;
        return (
            <Container text>
                <Header as="h2">Register</Header>
                <Input name='username' value={username} onChange={this.onChange} placeholder='Username' fluid/>
                <Input name='email' value={email} onChange={this.onChange} placeholder='Email' fluid/>
                <Input name='password' value={password} onChange={this.onChange} placeholder='Password' type='password' fluid/>
                <Button onClick={this.onSubmit}>Submit</Button>
            </Container>
        )
    }
}

const registerMutation = gql`
    mutation($username: String!, $email: String!, $password: String!) {
        register(username: $username, email: $email, password: $password)
    }
`;

export default graphql(registerMutation)(Register);