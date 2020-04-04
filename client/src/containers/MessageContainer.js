import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages';
import { Comment } from 'semantic-ui-react';

const MessageContainer = ({ channelId }) => {
    return (
        <Query query={messagesQuery} variables={{ channelId }}>
            {
                ({ loading, error, data }) => {
                    if (loading) return null;
                    if (error) console.log(error);
                    if (data) console.log(data);

                    const messages = data.messages;
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
                    );
                }
            }
        </Query>
    );
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