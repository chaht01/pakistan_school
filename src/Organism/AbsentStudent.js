import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import AttendBullet from '../Molcules/AttendBullet';
import { foreground } from '../const/colors';
import { fontDegrader } from '../utils/breakpoints';
import { attendance } from '../const/attendance';
import Typography from '@material-ui/core/Typography';

export default function AbsentStudent({ name, absenceStatus }) {
	return (
		<div>
			<Typography noWrap={true} variant={'button'} gutterBottom={true}>
				{name}
			</Typography>
			<div>
				<AttendBullet states={absenceStatus} />
			</div>
		</div>
		// <StyledGrid container spacing={0}>
		// 	<Grid item xs>
		// 		{name}
		// 	</Grid>
		// 	<Grid item>
		// 		<AttendBullet states={absenceStatus} />
		// 	</Grid>
		// </StyledGrid>
	);
}

AbsentStudent.propTypes = {
	name: PropTypes.string.isRequired,
	absenceStatus: PropTypes.arrayOf(function(propValue, key, componentName, location, propFullName) {
		return Object.values(attendance).indexOf(propValue) > -1;
	})
};
