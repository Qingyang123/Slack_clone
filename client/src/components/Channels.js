import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react';

const ChannelWrapper =  styled.div`
    grid-column: 2;
    grid-row: 1 / 4;
    background-color: #4e3a4c;
    color: #958993;
`;

const TeamNameHeader = styled.h1`
    color: #fff;
    font-size: 20px;
`;

const SideBarList = styled.ul`
    width: 100%;
    list-style: none;
    padding-left: 0px;
`;

const paddingLeft = 'padding-left: 10px';

const SideBarListItem = styled.li`
    padding: 2px;
    ${paddingLeft};
    &:hover {
        background: #3e313c;
    }
`;

const SideBarListHeader = styled.li`${paddingLeft};`;

const PushLeft = styled.div`${paddingLeft};`;

const Green = styled.span`color: #38978d;`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const channel = ({ id, name }, teamId) => (
    <Link to={`/view-team/${teamId}/${id}`} key={`channel-${id}`}>
        <SideBarListItem># {name}</SideBarListItem>
    </Link>
);

const user = ({ id, username }, userId, teamId) => (
    <SideBarListItem key={`user-${id}`}>
        <Link to={`/view-team/user/${teamId}/${id}`}><Bubble/> {username} {userId === id && "(you)"}</Link>
    </SideBarListItem>
)

export default ({ teamName, username, userId, channels, users, onAddChannelClick, onInvitePeopleClick, onDirectMessageClick, teamId, isOwner }) => (
    <ChannelWrapper>
        <PushLeft>
            <TeamNameHeader>{teamName}</TeamNameHeader>
            {username}
        </PushLeft>
        <div>
            <SideBarList>
            <SideBarListHeader>Channels { isOwner && <Icon name='add circle' onClick={onAddChannelClick}></Icon> }</SideBarListHeader>
                {channels.map(c => channel(c, teamId))}
            </SideBarList>
        </div>
        <div>
            <SideBarList>
                <SideBarListHeader>Direct Messages <Icon name='add circle' onClick={onDirectMessageClick}></Icon></SideBarListHeader>
                {users.map(u => user(u, userId, teamId))}
            </SideBarList>
        </div>
        {
            isOwner && (
                <div>
                    <a href='#invite-people' onClick={onInvitePeopleClick}>
                        + Invite People
                    </a>
                </div>
            )
        }
    </ChannelWrapper>
);