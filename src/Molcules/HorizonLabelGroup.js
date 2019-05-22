import React from 'react';
import styled from 'styled-components';
import { fontDegrader } from '../utils/breakpoints';

const Big = styled.span`font-size: ${fontDegrader(0)}px;`;
const Small = styled.span`
	font-size: ${fontDegrader(2)}px;
	opacity: 0.5;
`;
const Container = styled.div`
	display: flex;
	align-items: center;
	${props => props.reverse && `flex-direction: row-reverse;`};
	> * {
		margin-${props => (props.reverse ? `left` : `right`)}: ${fontDegrader(2)}px;
		&:last-child {
			margin-${props => (props.reverse ? `left` : `right`)}: 0;
		}
	}
`;

export default function HorizonLabelGroup({ small, big, reverse = false }) {
	return (
		<Container reverse={reverse}>
			<Small>{small}</Small>
			<Big>{big}</Big>
		</Container>
	);
}
