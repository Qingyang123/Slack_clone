import React from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag'
import Messages from '../components/Messages';

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
                            {/* <ul>{messages.map(message)}</ul> */}
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
            # user {
            #     username
            # }
            # createdAt
        }
    }
`;

export default MessageContainer;