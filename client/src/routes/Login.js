import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import { Container, Header, Form, Button } from 'semantic-ui-react';

export default observer(class Login extends Component{
    constructor(props) {
        super(props);

        extendObservable(this, {
            email: '',
            password: ''
        });
    }

    onChange = (e) => {
        this[e.target.name] = e.target.value;
    }

    onSubmit = () => {
        console.log(this.email);
        console.log(this.password);
    }

    render() {

        const { email, password } = this;
        return (
            <Container text>
                <Header as="h2">Login</Header>
                <Form>
                    <Form.Input 
                        name='email' 
                        value={email} 
                        onChange={this.onChange} 
                        label='Email' 
                        placeholder='Email' 
                        fluid />
                    <Form.Input 
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
})