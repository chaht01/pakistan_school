import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import AttendBullet from '../Molcules/AttendBullet';
import { foreground } from '../const/colors';
import { fontDegrader } from '../utils/breakpoints';
import { attendance } from '../const/attendance';

const StyledGrid = styled(Grid)`
	border-radius: 6px;
	background: ${foreground.red};
	padding: 0.5em 0 0.5em 1em;
	font-size: ${fontDegrader(3)}px;
	font-weight: 800;
	margin-bottom: 0.6em;
	color: #fff;
`;

export default function AbsentStudent({ name, absenceStatus }) {
	console.log(name, absenceStatus);
	return (
		<StyledGrid container spacing={0}>
			<Grid item xs>
				{name}
			</Grid>
			<Grid item>
				<AttendBullet states={absenceStatus} />
			</Grid>
		</StyledGrid>
	);
}

AbsentStudent.propTypes = {
	name: PropTypes.string.isRequired,
	absenceStatus: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
		return Object.values(attendance).indexOf(propValue) > -1;
	})
};
