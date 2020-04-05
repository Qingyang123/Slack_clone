import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages';
import { Comment } from 'semantic-ui-react';


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
    componentDidMount() {
        this.props.subscribeToNewMessages();
    }

    render() {
        const {messages} = this.props

        return (
            <Messages>
                <Comment.Group>
                    {
                        messages.map(m => (
                            <Comment key = {`message-${m.id}`}>
                                <Comment.Content>
                                    <Comment.Author as='a'>{m.user.username}</Comment.Author>
                                    <Comment.Metadata>
                                        <div>{m.createdAt}</div>
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
            </Messages>
        )
    }
}

class MessageContainer extends Component {


    render() {
        const { channelId } = this.props;
        return (
            <Query query={messagesQuery} variables={{ channelId }}>
                {
                    (props) => {
                        const { subscribeToMore, loading, error, data } = props;
                        if (loading) return null;
                        if (error) console.log(error);
                        if (data) console.log(data);
                            
                        const messages = data.messages;
                        return (
                            <MessageWrapper
                                messages={messages}
                                subscribeToNewMessages={() => (
                                    subscribeToMore({
                                        document: newChannelMessageSubscription,
                                        variables: { channelId },
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
    query($channelId: Int!) {
        messages(channelId: $channelId) {
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