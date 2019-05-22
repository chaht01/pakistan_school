import React from 'react';
import Paper from '@material-ui/core/Paper';
import styled from 'styled-components';

import { attendance, colorMatcher, fontMatcher } from '../const/attendance';
import { media } from '../utils/breakpoints';

const Card = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
	width: 100%;
	height: 100%;
  background-color: ${props => colorMatcher(props.status, props.elevated ? 1.0 : 0.5)};
  color: ${props => fontMatcher(props.status)};
  font-size: 1.4em;
  ${media.md`font-size: 1.2em;`}
  ${media.sm`font-size: 1.0em;`}
  font-weight: 800;
  ${props => props.elevated && `box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);`}
  cursor: pointer;
  transition: all .25s;

  &:before{
    position: absolute;
    display: block;
    content: '';
    left: 100%;
    bottom: 0,
    height: 100%;
    width: 0,
    borderRight: 1px solid #494949;
    opacity: 0.5
  }

  &:hover{
    background-color: ${props => colorMatcher(props.status, 1.0)};
    box-shadow: 0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22);
    z-index:1;
  }

`;

export default function AttendCard({ status, elevated, ...other }) {
	return <Card status={status.stat} elevated={elevated} {...other} />;
}
