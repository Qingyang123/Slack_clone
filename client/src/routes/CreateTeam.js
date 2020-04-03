import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Container, Header, Form, Button } from 'semantic-ui-react';

class CreateTeam extends Component{
    constructor(props) {
        super(props);

        extendObservable(this, {
            name: '',
            errors: {}
        });
    }

    onChange = (e) => {
        this[e.target.name] = e.target.value;
    }

    onSubmit = async () => {
        const { name } = this;
        let res = null;

        try {
            res = await this.props.mutate({
                variables: { name }
            });
        } catch(err) {
            console.log(err);
            this.props.history.push('/login');
            return;
        }
        
        
        console.log(res);

        const { ok, team, errors } = res.data.createTeam;
        if (ok) {
            this.props.history.push(`/view-team/${team.id}`);
        } else {
            const err = {}
            errors.forEach(({ path, message }) => {
                err[`${path}Error`] = message;
            })
            this.errors = err;
        }
    }

    render() {

        const { name, errors: {nameError} } = this;
        return (
            <Container text>
                <Header as="h2">Create a team</Header>
                <Form>
                    <Form.Input 
                        error={nameError}
                        name='name' 
                        value={name} 
                        onChange={this.onChange} 
                        label='Name' 
                        placeholder='Name' 
                        fluid />
                    <Button onClick={this.onSubmit} primary>Submit</Button>
                </Form>
            </Container>
        );
    }
}

const createTeamMutation = gql`
    mutation($name: String!) {
        createTeam(name: $name) {
            ok
            team {
                id
            }
            errors {
                path
                message
            }
        }
    }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));