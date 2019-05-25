import React, { useState, Fragment, useEffect } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ChipInput from 'material-ui-chip-input';
import ReactAutosuggestRemote from '../Molcules/ReactAutosuggestRemote';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import ScheduleBullet from '../Molcules/ScheduleBullet';
import FinalCheckDialog from '../Organism/FinalCheckDialog';
import { foreground } from '../const/colors';
import axios from 'axios';
import Schedule from '../Organism/Schedule';

const styles = theme => ({
	root: {
		backgroundColor: foreground.lightGreenGray,
		paddingTop: theme.spacing(8)
	},
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(900 + theme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	sectionHeading: {
		...theme.typography.button,
		fontSize: '1rem'
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(4)}px ${theme.spacing(6)}px`
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		width: 225,
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		[theme.breakpoints.up(225 + theme.spacing(3 * 2))]: {
			width: 'auto'
		}
	},
	selectFullWidth: {
		width: '100%'
	},
	grow: {
		flex: 1
	},
	gutterContainer: {
		width: `calc(100% + ${theme.spacing(4)}px)`,
		marginLeft: -2 * theme.spacing(1)
	},
	gutter: {
		padding: theme.spacing(2)
	},
	marginNormal: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(8)
	}
	// scheduleBulletControl: theme.Input.FormControl
});

function OpenClass({ classes }) {
	const [instructorPool, setInstructorPool] = useState([]);
	const [studentPool, setStudentPool] = useState([]);
	const [instructorChips, setInstructorChips] = useState({ value: [], error: false, dirty: false });
	const [studentChips, setStudentChips] = useState({ value: [], error: false, dirty: false });
	const [className, handleClassName] = useState({ value: '', error: false, dirty: false });
	const [startDate, handleStartDate] = useState({ value: new Date(), error: false, dirty: true });
	const [endDate, handleEndDate] = useState({ value: new Date(), error: false, dirty: true });
	const [startTime, handleStartTime] = useState({ value: new Date(), error: false, dirty: true });
	const [endTime, handleEndTime] = useState({ value: new Date(), error: false, dirty: true });
	const [days, handleDays] = useState({ value: [0, 0, 0, 0, 0, 0, 0], error: false, dirty: false });
	const [buildings, setBuildings] = useState([]);
	const [building, setBuilding] = useState(-1);

	useEffect(() => {
		async function fetchBuildings() {
			const { data } = await axios({ method: 'get', url: 'http://teaching.talk4u.kr/api/buildings/' });
			setBuildings(data);
			setBuilding(data[0].id);
		}
		fetchBuildings();
	}, []);

	useEffect(() => {
		async function fetchPool() {
			const { data: instructors } = await axios({
				method: 'get',
				url: 'http://teaching.talk4u.kr/api/users/',
				params: { role: 'Instructor' }
			});
			const { data: students } = await axios({
				method: 'get',
				url: 'http://teaching.talk4u.kr/api/users/',
				params: { role: 'Student' }
			});
			setInstructorPool(instructors);
			setStudentPool(students);
		}
		fetchPool();
	}, []);

	return (
		<div className={classes.root}>
			<main className={classes.main}>
				<Paper className={classes.paper}>
					<form
						className={classes.form}
						onSubmit={e => {
							e.preventDefault();
						}}
					>
						<FormGroup className={classes.marginNormal}>
							<Typography className={classes.sectionHeading}>Class Info</Typography>
							<div className={classes.gutter}>
								<FormControl required fullWidth>
									<TextField
										label="Class Name"
										autoFocus
										value={className.value}
										error={className.error}
										required
										onBlur={e =>
											handleClassName({
												...className,
												error: e.target.value.length === 0,
												dirty: true
											})}
										onChange={e =>
											handleClassName({
												...className,
												value: e.target.value,
												error: e.target.value.length === 0,
												dirty: true
											})}
									/>
								</FormControl>
							</div>
							<div className={classes.gutter}>
								<FormControl className={classes.selectFullWidth}>
									<InputLabel htmlFor="building-select">Building</InputLabel>
									<Select
										value={building}
										displayEmpty
										input={<Input fullWidth name="building" id="building-select" />}
										onChange={e => setBuilding(e.target.value)}
									>
										{buildings.map(b => <MenuItem value={b.id}>{b.name}</MenuItem>)}
									</Select>
								</FormControl>
							</div>
						</FormGroup>

						<FormGroup className={classes.marginNormal}>
							<Typography className={classes.sectionHeading}>Schedule</Typography>
							<Schedule
								editable
								startDate={startDate}
								handleStartDate={handleStartDate}
								endDate={endDate}
								handleEndDate={handleEndDate}
								startTime={startTime}
								handleStartTime={handleStartTime}
								endTime={endTime}
								handleEndTime={handleEndTime}
								initDays={days}
								handleDays={handleDays}
							/>
						</FormGroup>
						<FormGroup className={classes.marginNormal}>
							<Typography className={classes.sectionHeading}>Members</Typography>
							<div className={classes.gutter}>
								<FormControl required fullWidth>
									<ReactAutosuggestRemote
										label="Instructors"
										fullWidth
										required
										newChipKeyCodes={[13, 188]}
										placeholder="Search a instructors"
										chips={instructorChips.value}
										setChips={value =>
											setInstructorChips({
												...instructorChips,
												value,
												dirty: true,
												error: value.length === 0
											})}
										dataSource={instructorPool}
										error={instructorChips.error}
										helperText={
											(instructorChips.error || instructorChips.value.length === 0) &&
											`Needs at least one instructor`
										}
									/>
								</FormControl>
							</div>
							<div className={classes.gutter}>
								<FormControl required fullWidth>
									<ReactAutosuggestRemote
										label="Students"
										fullWidth
										required
										newChipKeyCodes={[13, 188]}
										placeholder="Search a students"
										chips={studentChips.value}
										setChips={value =>
											setStudentChips({
												...studentChips,
												value,
												dirty: true,
												error: value.length === 0
											})}
										dataSource={studentPool}
										error={studentChips.error}
										helperText={
											(studentChips.error || studentChips.value.length === 0) &&
											`Needs at least one student`
										}
										disabled={studentPool.length === 0}
									/>
								</FormControl>
							</div>
						</FormGroup>
					</form>
				</Paper>
				<Grid container className={classes.demo} justify="center" spacing={6}>
					<Grid item>
						<Button fullWidth color="default" className={classes.submit}>
							Cancel
						</Button>
					</Grid>
					<Grid item>
						<FinalCheckDialog
							toSave={{
								startDate: startDate.value,
								endDate: endDate.value,
								startTime: startTime.value,
								endTime: endTime.value,
								instructorChips: instructorChips.value,
								studentChips: studentChips.value,
								className: className.value,
								days: days.value,
								building
							}}
							scheduleComp={() => (
								<Fragment>
									<Typography className={classes.sectionHeading}>Schedule</Typography>
									<Schedule
										editable
										startDate={startDate}
										handleStartDate={handleStartDate}
										endDate={endDate}
										handleEndDate={handleEndDate}
										startTime={startTime}
										handleStartTime={handleStartTime}
										endTime={endTime}
										handleEndTime={handleEndTime}
										initDays={days}
										handleDays={handleDays}
									/>
								</Fragment>
							)}
							triggerComponent={props => (
								<Button
									{...props}
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
									disabled={
										!className.dirty ||
										className.error ||
										(!startDate.dirty || startDate.error) ||
										(!endDate.dirty || endDate.error) ||
										(!startTime.dirty || startTime.error) ||
										(!endTime.dirty || endTime.error) ||
										(!days.dirty || days.error) ||
										(instructorChips.error || instructorChips.value.length === 0) ||
										(studentChips.error || studentChips.value.length === 0)
									}
								>
									Confirm
								</Button>
							)}
						/>
					</Grid>
				</Grid>
			</main>
		</div>
	);
}

export default withStyles(styles)(OpenClass);
