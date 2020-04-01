import React from 'react';
import styled from 'styled-components';
import {Input} from 'semantic-ui-react'


const Styles = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
`

export default ({ channelName }) => (
    <Styles>
        <Input fluid placeholder={`Message #${channelName}`}/>
    </Styles>
) 