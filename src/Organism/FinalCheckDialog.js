import React, { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import axios from 'axios';
import { format } from 'date-fns';
import { withRouter } from 'react-router';

const styles = theme => ({
	dialog: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		[theme.breakpoints.up(900 + theme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paperWidthLg: 900
});

function FinalCheckDialog({
	classes,
	triggerComponent: Trigger,
	scheduleComp: ScheduleComp,
	toSave,
	history,
	validate,
	raiseError,
	location
}) {
	const [open, setOpen] = useState(false);

	function handleClickOpen() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}

	async function save() {
		const validateMsg = validate();
		if (Object.keys(validateMsg).length > 0) {
			raiseError(validateMsg);
			// console.log(validateMsg);
			return;
		}
		const {
			startDate: start_date,
			endDate: end_date,
			startTime: start_time,
			endTime: end_time,
			instructorChips: instructors,
			studentChips: students,
			className: name,
			days: day_of_weeks,
			building
		} = toSave;
		const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		await axios({
			method: 'post',
			url: '/api/classrooms/',
			data: {
				name,
				building,
				end_date: format(end_date, 'yyyy-MM-dd'),
				start_date: format(start_date, 'yyyy-MM-dd'),
				student_ids: students.map(item => item.id),
				instructor_ids: instructors.map(item => item.id),
				schedule: {
					start_time: format(start_time, 'hh:mm:ss'),
					end_time: format(end_time, 'hh:mm:ss'),
					day_of_weeks: day_of_weeks.reduce((acc, curr, idx) => {
						if (curr) {
							acc.push(weekdays[idx]);
						}
						return acc;
					}, [])
				}
			}
		})
			.then(({ data: resolved }) => {
				handleClose();
				history.replace(`/classroom/${resolved.id}`);
			})
			.catch(() => {});
	}

	return (
		<Fragment>
			<Trigger variant="outlined" color="primary" onClick={handleClickOpen} />
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				className={classes.dialog}
				maxWidth="lg"
			>
				<DialogTitle id="form-dialog-title">Final Check</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Schedule cannot be modifed after creation. Make sure below settings.
					</DialogContentText>
					<ScheduleComp />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="default">
						Cancel
					</Button>
					<Button onClick={save} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}

export default withRouter(withStyles(styles)(FinalCheckDialog));
