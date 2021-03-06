import React, { useState, Fragment, useEffect } from 'react';
import { withRouter } from 'react-router';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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

const defaultTheme = createMuiTheme();

const styles = theme => ({
	root: {
		backgroundColor: foreground.lightGreenGray,
		paddingTop: defaultTheme.spacing(8)
	},
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: defaultTheme.spacing(3),
		marginRight: defaultTheme.spacing(3),
		[defaultTheme.breakpoints.up(900 + defaultTheme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	sectionHeading: {
		...defaultTheme.typography.button,
		fontSize: '1rem'
	},
	paper: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${defaultTheme.spacing(2)}px ${defaultTheme.spacing(4)}px ${defaultTheme.spacing(6)}px`
	},
	avatar: {
		margin: defaultTheme.spacing(1),
		backgroundColor: defaultTheme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: defaultTheme.spacing(1)
	},
	submit: {
		width: 225,
		marginTop: defaultTheme.spacing(3),
		marginBottom: defaultTheme.spacing(3),
		[defaultTheme.breakpoints.up(225 + defaultTheme.spacing(3 * 2))]: {
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
		width: `calc(100% + ${defaultTheme.spacing(4)}px)`,
		marginLeft: -2 * defaultTheme.spacing(1)
	},
	gutter: {
		padding: defaultTheme.spacing(2)
	},
	marginNormal: {
		marginTop: defaultTheme.spacing(2),
		marginBottom: defaultTheme.spacing(8)
	}
	// scheduleBulletControl: defaultTheme.Input.FormControl
});

function ManageClass({ classes, match, history }) {
	const { params: { classId }, path } = match;
	if (!classId || classId <= 0 || isNaN(classId)) {
		history.goBack();
	}

	const [classroom, setClassroom] = useState(null);
	const [instructorPool, setInstructorPool] = useState([]);
	const [studentPool, setStudentPool] = useState([]);
	const [instructorChips, setInstructorChips] = useState({ value: [], error: false, dirty: true });
	const [studentChips, setStudentChips] = useState({ value: [], error: false, dirty: true });
	const [className, handleClassName] = useState({ value: '', error: false, dirty: true });
	const [startDate, handleStartDate] = useState({ value: new Date(), error: false, dirty: true });
	const [endDate, handleEndDate] = useState({ value: new Date(), error: false, dirty: true });
	const [startTime, handleStartTime] = useState({ value: new Date(), error: false, dirty: true });
	const [endTime, handleEndTime] = useState({ value: new Date(), error: false, dirty: true });
	const [days, handleDays] = useState({ value: [0, 0, 0, 0, 0, 0, 0], error: false, dirty: true });
	const [buildings, setBuildings] = useState([]);
	const [building, setBuilding] = useState(-1);
	const [error, setError] = useState({ value: false, message: '' });

	useEffect(() => {
		async function fetchClassroom() {
			try {
				const { data: classroom } = await axios({ method: 'get', url: `/api/classrooms/${classId}` });
				setClassroom(classroom);
				const {
					start_date,
					end_date,
					start_time,
					end_time,
					instructors,
					students,
					name,
					lessons,
					building: buildingId
				} = classroom;
				const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				const day_of_weeks = lessons.map(lesson => lesson.day_of_week);

				setInstructorChips({ ...instructorChips, value: instructors, dirty: true });
				setStudentChips({ ...studentChips, value: students, dirty: true });
				handleClassName({ ...className, value: name, dirty: true });
				handleStartDate({ ...startDate, value: new Date(start_date), dirty: true });
				handleEndDate({ ...endDate, value: new Date(end_date), dirty: true });
				handleStartTime({ ...startTime, value: new Date(`${start_date} ${start_time}`), dirty: true });
				handleEndTime({
					value: new Date(`${end_date} ${end_time}`),
					dirty: true
				});
				handleDays({
					...days,
					value: weekdays.map(weekday => (day_of_weeks.indexOf(weekday) > -1 ? 1 : 0)),
					dirty: true
				});
				setBuilding(buildingId);
			} catch (err) {
				history.goBack();
			}
		}
		fetchClassroom();
	}, []);

	useEffect(() => {
		async function fetchBuildings() {
			const { data } = await axios({ method: 'get', url: '/api/buildings/' });
			setBuildings(data);
		}
		fetchBuildings();
	}, []);

	useEffect(() => {
		async function fetchPool() {
			const { data: instructors } = await axios({
				method: 'get',
				url: '/api/users/',
				params: { role: 'Instructor' }
			});
			const { data: students } = await axios({
				method: 'get',
				url: '/api/users/',
				params: { role: 'Student' }
			});
			setInstructorPool(instructors);
			setStudentPool(students);
		}
		fetchPool();
	}, []);

	function validate() {
		const agenda = [className, startDate, endDate, startTime, endTime, days];
		const label = ['Class Name', 'Start Date', 'End Date', 'Start Time', 'End Time', 'Schedule'];

		let msg = {};

		agenda.map((criteria, idx) => {
			if (!criteria.dirty || criteria.error) {
				msg[label[idx]] = '값이 없거나 잘못 입력되었습니다.';
			}
		});

		if (instructorChips.error || instructorChips.value.length === 0) {
			msg['Instructors'] = '1명 이상의 강사가 필요합니다';
		}

		if (studentChips.error || studentChips.value.length === 0) {
			msg['Students'] = '1명 이상의 학생이 필요합니다';
		}

		return msg;
	}

	function raiseError(msg) {
		let message = Object.entries(msg).map(([key, value]) => <div>{`${key}: ${value}`}</div>);
		setError({
			value: true,
			message
		});
	}
	function onCloseError() {
		setError({
			value: false,
			message: ''
		});
	}

	async function save() {
		const validateMsg = validate();
		if (Object.keys(validateMsg).length > 0) {
			raiseError(validateMsg);
			// console.log(validateMsg);
			return;
		}
		await axios({
			method: 'patch',
			url: `/api/classrooms/${classroom.id}/`,
			data: {
				name: className.value,
				building,
				student_ids: studentChips.value.map(item => item.id),
				instructor_ids: instructorChips.value.map(item => item.id)
			}
		})
			.then(({ data: resolved }) => {
				history.replace(`/classroom/${resolved.id}`);
			})
			.catch(() => {});
	}

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
								disabled
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
						<Button fullWidth color="default" className={classes.submit} onClick={() => history.goBack()}>
							Cancel
						</Button>
					</Grid>
					<Grid item>
						<Button
							fullWidth
							variant="contained"
							color="secondary"
							className={classes.submit}
							onClick={save}
						>
							Save
						</Button>
					</Grid>
				</Grid>
			</main>
			<Snackbar
				open={error.value}
				onClose={onCloseError}
				TransitionComponent={Slide}
				ContentProps={{
					'aria-describedby': 'message-id'
				}}
				message={error.message}
				action={[
					<IconButton key="close" aria-label="Close" color="inherit" onClick={onCloseError}>
						<CloseIcon />
					</IconButton>
				]}
			/>
		</div>
	);
}

export default withRouter(withStyles(styles)(ManageClass));
