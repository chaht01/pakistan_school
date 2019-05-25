import React, { useState, Fragment, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import FormControl from '@material-ui/core/FormControl';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import ScheduleBullet from '../Molcules/ScheduleBullet';
import { isBefore, isAfter } from 'date-fns';

function Schedule({
	classes,
	startDate,
	handleStartDate,
	endDate,
	handleEndDate,
	startTime,
	handleStartTime,
	endTime,
	handleEndTime,
	editable,
	initDays,
	handleDays,
	...rest
}) {
	return (
		<FormGroup>
			<Grid container spacing={24}>
				<Grid item xs={8} md>
					<FormGroup className={`${classes.grow} ${classes.gutter}`}>
						<FormControl margin="dense" required>
							<DatePicker
								label="Start Date"
								value={startDate.value}
								onChange={value =>
									handleStartDate({
										...startDate,
										value,
										error: isAfter(value, endDate.value),
										dirty: true
									})}
								error={isAfter(startDate.value, endDate.value)}
								animateYearScrolling
							/>
						</FormControl>
						<FormControl margin="dense" required>
							<DatePicker
								label="End Date"
								value={endDate.value}
								onChange={value =>
									handleEndDate({
										...endDate,
										value,
										error: isAfter(startDate.value, value),
										dirty: true
									})}
								error={isAfter(startDate.value, endDate.value)}
								animateYearScrolling
							/>
						</FormControl>
					</FormGroup>
				</Grid>
				<Grid item xs={8} md>
					<FormGroup className={`${classes.grow} ${classes.gutter}`}>
						<ScheduleBullet
							label={'Schedule'}
							editable={editable}
							initDays={initDays.value}
							handleDays={value =>
								handleDays({
									...initDays,
									value,
									error: !value.reduce((acc, curr) => acc || curr),
									dirty: true
								})}
							error={initDays.error}
							fullWidth={true}
						/>
					</FormGroup>
				</Grid>
				<Grid item xs={8} md>
					<FormGroup className={`${classes.grow} ${classes.gutter}`}>
						<FormControl margin="dense" required>
							<TimePicker
								label="Start Time"
								value={startTime.value}
								onChange={value =>
									handleStartTime({
										...startTime,
										value,
										error: isAfter(value, endTime.value),
										dirty: true
									})}
								error={isAfter(startTime.value, endTime.value)}
								animateYearScrolling
							/>
						</FormControl>
						<FormControl margin="dense" required>
							<TimePicker
								label="End Time"
								value={endTime.value}
								onChange={value =>
									handleEndTime({
										...endTime,
										value,
										error: isAfter(startTime.value, value),
										dirty: true
									})}
								error={isAfter(startTime.value, endTime.value)}
								animateYearScrolling
							/>
						</FormControl>
					</FormGroup>
				</Grid>
			</Grid>
		</FormGroup>
	);
}

export default withStyles(theme => ({
	grow: {
		flex: 1
	},
	gutter: {
		padding: theme.spacing(2)
	}
}))(Schedule);
