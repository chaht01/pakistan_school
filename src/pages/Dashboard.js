import React, { Fragment, useState, useEffect } from 'react';
import { styled as styledUI } from '@material-ui/styles';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
import { foreground } from '../const/colors';
import HorizonLabelGroup from '../Molcules/HorizonLabelGroup';

import Card from '@material-ui/core/Card';

import Backbone, { StructuredBar, StructuredContent } from '../Molcules/Backbone';
import PreviewStepper from '../Organism/PreviewStepper';
import AbsenceCounter from '../Organism/AbsenceCounter';
import { attendance } from '../const/attendance';
import { base } from '../const/size';

const Carousel = styled.div`
	height: 100%;
	padding: 150px 30px 0;
	height: 100%;
	background: #fff;
`;

Carousel.Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 30px;
	height: 100%;
`;
Carousel.Item = styledUI(Card)({
	background: `${foreground.lightGreenGray} !important`
});

const styles = theme => ({
	statBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		verticalAlignment: 'bottom',
		width: '100%',
		height: `${base.subbar}px`,
		background: `${foreground.lightGreenGray}`,
		lineHeight: 1.2,
		padding: '0 60px 24px'
	}
});

function Dashboard({ classes }) {
	const { attended, none, absence, scheduled } = attendance;
	const dummyClassInfo = [
		{
			title: 'Math',
			lecturer: 'James',
			schedule: {
				initDays: [1, 0, 1, 0, 1, 1, 0],
				startTime: Date.now(),
				endTime: Date.now() + 300000
			},
			absences: [
				{ name: 'alice', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: 'Amily', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: '차현탁', absenceStatus: [absence, none, attended, none, attended, scheduled, none] }
			]
		},
		{
			title: 'English',
			lecturer: 'James',
			schedule: {
				initDays: [1, 0, 1, 0, 1, 1, 0],
				startTime: Date.now(),
				endTime: Date.now() + 300000
			},
			absences: [
				{ name: 'alice', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: 'Amily', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: '차현탁', absenceStatus: [absence, none, attended, none, attended, scheduled, none] }
			]
		},
		{
			title: 'Korean',
			lecturer: 'James',
			schedule: {
				initDays: [1, 0, 1, 0, 1, 1, 0],
				startTime: Date.now(),
				endTime: Date.now() + 300000
			},
			absences: [
				{ name: 'alice', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: 'Amily', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: '차현탁', absenceStatus: [absence, none, attended, none, attended, scheduled, none] }
			]
		},
		{
			title: 'Bible',
			lecturer: 'James',
			schedule: {
				initDays: [1, 0, 1, 0, 1, 1, 0],
				startTime: Date.now(),
				endTime: Date.now() + 300000
			},
			absences: [
				{ name: 'alice', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: 'Amily', absenceStatus: [attended, none, attended, none, absence, scheduled, none] },
				{ name: '차현탁', absenceStatus: [absence, none, attended, none, attended, scheduled, none] }
			]
		}
	];

	return (
		<Fragment>
			<Backbone
				header={
					<div className={classes.statBar}>
						<AbsenceCounter />
					</div>
				}
				content={
					<PreviewStepper
						classInfo={dummyClassInfo.reduce((acc, curr) => {
							if (acc.length === 0 || acc[acc.length - 1].length === 3) {
								acc.push([]);
							}
							acc[acc.length - 1].push(curr);
							return acc;
						}, [])}
					/>
				}
				space={base.subbar}
			/>
		</Fragment>
	);
}
export default withStyles(styles)(Dashboard);
