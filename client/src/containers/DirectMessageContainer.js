import React, { Component } from 'react'
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import Messages from '../components/Messages';
import { Comment } from 'semantic-ui-react';


const newDirectMessageSubscription = gql`
    subscription($teamId: Int!, $otherUserId: Int!) {
        newDirectMessage(teamId: $teamId, otherUserId: $otherUserId) {
            id
            sender {
                username
            }
            text
            created_at
        }
    }
`;


class DirectMessageWrapper extends Component {

    componentWillMount() {
        // console.log('props: ', this.props.channelId)
        // console.log(`subscribing to ${this.props.channelId}`)

        this.unscubscribe = this.props.subscribeToNewDirectMessages(this.props.teamId, this.props.otherUserId);
    }

    componentWillReceiveProps({ teamId, otherUserId }) {
        // console.log('props: ', this.props.channelId, channelId)
        if (this.props.teamId !== teamId || this.props.otherUserId !== otherUserId) { 
            if(this.unscubscribe) {
                // console.log(`unsubscribing to ${this.props.channelId}`)
                this.unscubscribe()
            }
            // console.log(`subscribing to ${channelId}`)

            this.unscubscribe = this.props.subscribeToNewDirectMessages(teamId, otherUserId);
        }
    }
    componentWillUnmount() {
        if(this.unscubscribe) {
            // console.log(`unsubscribing to ${this.props.channelId}`)
            this.unscubscribe()
        }
    }

    render() {
        const {directMessages} = this.props

        return (
            <Messages>
                <Comment.Group>
                    {
                        directMessages.map(m => (
                            <Comment key = {`directMessage-${m.id}`}>
                                <Comment.Content>
                                    <Comment.Author as='a'>{m.sender.username}</Comment.Author>
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
            </Messages>
        )
    }
}

class DirectMessageContainer extends Component {


    render() {
        const { teamId, otherUserId } = this.props;
        return (
            <Query query={directMessagesQuery} variables={{ teamId: parseInt(teamId), otherUserId: parseInt(otherUserId) }} fetchPolicy={"network-only"}>
                {
                    (props) => {
                        // console.log(props);
                        const { subscribeToMore, loading, error, data } = props;
                        if (loading) return null;
                        if (error) console.log(error);
                        if (data) console.log(data);
                            
                        const directMessages = data.directMessages;
                        return (
                            <DirectMessageWrapper
                                directMessages={directMessages}
                                teamId={teamId}
                                otherUserId={otherUserId}
                                subscribeToNewDirectMessages={() => (
                                    subscribeToMore({
                                        document: newDirectMessageSubscription,
                                        variables: { teamId: parseInt(teamId), otherUserId: parseInt(otherUserId) },
                                        fetchPolicy: 'network-only',
                                        updateQuery: (prev, { subscriptionData }) => {
                                            console.log('prev: ', prev);
                                            console.log('subscriptionData: ', subscriptionData);
                                            if (! subscriptionData.data) return prev;
                                            return {
                                                ...prev,
                                                directMessages: [...prev.directMessages, subscriptionData.data.newDirectMessage]
                                            }
                                        },
                                        onError: err => console.error(err),
                                    })
                                )}
                                />
                        );
                    }
                }
            </Query>
        );
    }
}


const directMessagesQuery = gql`
    query($teamId: Int!, $otherUserId: Int!) {
        directMessages(teamId: $teamId, otherUserId: $otherUserId){
            id
            sender {
                username
            }
            text
            created_at
        }
    }
`;

export default DirectMessageContainer;