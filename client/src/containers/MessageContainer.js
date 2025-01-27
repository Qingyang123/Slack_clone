import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { Button, Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';
import FileUpload from '../components/FileUpload';


const newChannelMessageSubscription = gql`
    subscription($channelId: Int!) {
        newChannelMessage(channelId: $channelId) {
            id
            text
            user {
                username
            }
            createdAt
        }
    }
`;

class MessageWrapper extends Component {

    state = {
        hasMoreMessages: true
    };

    componentWillMount() {
        // console.log('props: ', this.props.channelId)
        // console.log(`subscribing to ${this.props.channelId}`)

        this.unscubscribe = this.props.subscribeToNewMessages(this.props.channelId);
    }

    componentWillReceiveProps({ channelId }) {
        // console.log('props: ', this.props.channelId, channelId)
        if (this.props.channelId !== channelId) { 
            if(this.unscubscribe) {
                // console.log(`unsubscribing to ${this.props.channelId}`)
                this.unscubscribe(this.props.channelId)
            }
            // console.log(`subscribing to ${channelId}`)

            this.unscubscribe = this.props.subscribeToNewMessages(channelId);
        }
    }
    componentWillUnmount() {
        if(this.unscubscribe) {
            // console.log(`unsubscribing to ${this.props.channelId}`)
            this.unscubscribe(this.props.channelId)
        }
    }

    render() {
        const {messages, channelId, fetchMore} = this.props

        return (
            <Messages>
                <FileUpload disableClick channelId={channelId}>
                    <Comment.Group>
                        {
                            this.state.hasMoreMessages && <Button onClick={() => fetchMore({
                                variables: {
                                    channelId: parseInt(channelId),
                                    offset: messages.length
                                },
                                updateQuery: (prev, { fetchMoreResult }) => {
                                    if (!fetchMoreResult) {
                                        return prev;
                                    }
                                    if(fetchMoreResult.messages.length < 10) {
                                        this.setState({hasMoreMessages: false})
                                    }
                                    return {
                                        ...prev,
                                        messages: [ ...fetchMoreResult.messages, ...prev.messages]
                                    }
                                }
                            })}>Load more</Button>
                        }
                        {
                            messages.map(m => (
                                <Comment key = {`message-${m.id}`}>
                                    <Comment.Content>
                                        <Comment.Author as='a'>{m.user.username}</Comment.Author>
                                        <Comment.Metadata>
                                            { moment(m.createdAt,"ddd MMM D YYYY HH:mm:ss").fromNow()}
                                        </Comment.Metadata>
                                        <Comment.Text>{m.text}</Comment.Text>
                                        <Comment.Actions>
                                        <Comment.Action>Reply</Comment.Action>
                                        </Comment.Actions>
                                    </Comment.Content>
                                </Comment>
                            ))
                        }
                    </Comment.Group>
                </FileUpload>
            </Messages>
        )
    }
}

class MessageContainer extends Component {


    render() {
        const { channelId } = this.props;
        return (
            <Query query={messagesQuery} variables={{ channelId, offset: 0 }} fetchPolicy={"network-only"}>
                {
                    (props) => {
                        const { subscribeToMore, loading, error, data, fetchMore } = props;
                        if (loading) return null;
                        if (error) console.log(error);
                        if (data) console.log(data);
                            
                        const messages = data.messages;
                        return (
                            <MessageWrapper
                                messages={messages}
                                channelId={channelId}
                                fetchMore={fetchMore}
                                subscribeToNewMessages={() => (
                                    subscribeToMore({
                                        document: newChannelMessageSubscription,
                                        variables: { channelId },
                                        fetchPolicy: 'network-only',
                                        updateQuery: (prev, { subscriptionData }) => {
                                            console.log('prev: ', prev);
                                            console.log('subscriptionData: ', subscriptionData);
                                            if (! subscriptionData.data) return prev;
                                            return {
                                                ...prev,
                                                messages: [...prev.messages, subscriptionData.data.newChannelMessage]
                                            }
                                        },
                                        onError: err => console.error(err),
                                    })
                                )}/>
                        );
                    }
                }
            </Query>
        );
    }
}


const messagesQuery = gql`
    query($channelId: Int!, $offset: Int!) {
        messages(channelId: $channelId, offset: $offset) {
            id
            text
            user {
                username
            }
            createdAt
        }
    }
`;

export default MessageContainer;