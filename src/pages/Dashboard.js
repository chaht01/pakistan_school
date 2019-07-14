import React, { Fragment, useState, useEffect } from 'react';
import { styled as styledUI } from '@material-ui/styles';
import styled from 'styled-components';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { foreground } from '../const/colors';
import Card from '@material-ui/core/Card';
import Statbar from '../Organism/Statbar';
import isWithinInterval from 'date-fns/isWithinInterval';
import { differenceInDays } from 'date-fns';
import PreviewStepper from '../Organism/PreviewStepper';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { attendance, asyncAttendance } from '../const/attendance';
import format from 'date-fns/format';
import { DateConsumer } from '../Context/DateContext';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';

const defaultTheme = createMuiTheme();
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
	formControl: {
		margin: defaultTheme.spacing(1),
		width: '100%',
		[defaultTheme.breakpoints.down('sm')]: {
			maxWidth: 120
		},
		[defaultTheme.breakpoints.up('sm')]: {
			maxWidth: 200
		},
		[defaultTheme.breakpoints.up('md')]: {
			maxWidth: 200
		},
		[defaultTheme.breakpoints.up('lg')]: {
			maxWidth: 200
		}
	}
});

function Dashboard({ classes, range: [startDate, endDate] }) {
	const { attended, none, absence, scheduled, makeup } = attendance;
	const [classInfo, setClassInfo] = useState([]);
	const [timer, setTimer] = useState(new Date());
	const [loaded, setLoaded] = useState(false);
	const [dialogOpened, setDialogOpened] = useState(false);
	const [buildings, setBuildings] = useState([]);
	const [building, setBuilding] = useState(-1);
	const handleChange = event => {
		setBuilding(oldValues => event.target.value);
	};

	function handleDialogClose() {
		setDialogOpened(false);
	}

	function tick() {
		setTimer(new Date());
	}

	useEffect(() => {
		async function fetchBuildings() {
			const { data } = await axios({ method: 'get', url: '/api/buildings/' });
			setBuildings(data);
			console.log(data);
			if (data[0] === undefined) {
				setLoaded(true);
				setDialogOpened(true);
			} else {
				setBuilding(data[0].id);
			}
		}
		fetchBuildings();
	}, []);

	useEffect(
		() => {
			var timerID = setInterval(() => tick(), 60000);
			async function fetchClassRoom() {
				const { data: classrooms } = await axios({
					method: 'get',
					url: '/api/classrooms/',
					params: {
						start_date__lte: format(startDate, 'yyyy-MM-dd'),
						end_date__gte: format(endDate, 'yyyy-MM-dd')
					}
				});

				const classrooms_with_schedule = classrooms.filter(info => info.building === building).map(info => ({
					...info,
					schedule: {
						initDays: (lessons => {
							let ret = [0, 0, 0, 0, 0, 0, 0];
							const mask = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
							lessons.map(lesson => (ret[mask.indexOf(lesson['day_of_week'])] = 1));
							return ret;
						})(info.lessons),
						startTime: info.lessons[0].start_time.slice(0, -3),
						endTime: info.lessons[0].end_time.slice(0, -3)
					}
				}));

				const processed = await Promise.all(
					classrooms_with_schedule.map(async ({ id, schedule, ...rest }) => {
						const { initDays } = schedule;
						let { data: attendances } = await axios({
							method: 'get',
							url: `/api/classrooms/${id}/attendance/`,
							params: {
								date__gte: format(startDate, 'yyyy-MM-dd'),
								date__lte: format(endDate, 'yyyy-MM-dd')
							}
						});
						let arrangeByStudent = {};
						attendances.map(attd => {
							if (!(attd.student in arrangeByStudent)) {
								arrangeByStudent[attd.student] = {
									name: attd.student_name,
									absenceStatus: initDays.map(val => (val === 0 ? none : scheduled)),
									netAbsenceCnt: 0
								};
							}
							const offset = differenceInDays(new Date(attd.date), startDate);
							arrangeByStudent[attd.student]['absenceStatus'][offset] =
								attendance[asyncAttendance[attd.status]];

							if (attendance[asyncAttendance[attd.status]] === absence) {
								arrangeByStudent[attd.student]['netAbsenceCnt']++;
							} else if (
								attendance[asyncAttendance[attd.status]] === makeup &&
								isWithinInterval(new Date(attd.make_up_for), { start: startDate, end: endDate })
							) {
								arrangeByStudent[attd.student]['netAbsenceCnt']--;
							}
						});
						let absences = Object.entries(arrangeByStudent)
							.filter(([id, attendanceStatus]) => attendanceStatus.netAbsenceCnt > 0)
							.map(([id, attendanceStatus]) => ({
								id,
								...attendanceStatus
							}));
						return {
							id,
							schedule,
							absences,
							...rest
						};
					})
				);

				console.log(processed);
				setClassInfo(processed.filter(({ absences }) => absences.length > 0));
				setLoaded(true);
			}
			fetchClassRoom();
			return function cleanup() {
				clearInterval(timerID);
			};
		},
		[timer, building, startDate, endDate]
	);

	return (
		<Fragment>
			<DateConsumer>
				{({ globalNow: selectedDate }) => (
					<Statbar
						adornment={
							<FormControl className={classes.formControl}>
								{loaded ? (
									<Select
										value={building}
										autoWidth
										displayEmpty
										name="building"
										onChange={handleChange}
									>
										{buildings.map(b => <MenuItem value={b.id}>{b.name}</MenuItem>)}
									</Select>
								) : (
									<CircularProgress />
								)}
							</FormControl>
						}
						building={building}
						current={selectedDate}
					>
						<PreviewStepper classInfo={classInfo} />
					</Statbar>
				)}
			</DateConsumer>
			<Dialog
				open={dialogOpened}
				onClose={handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">{'Warning'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You may not be assigned any buidling to manage. Contact administrator of this service who can
						access backend web UI to assign buildings to your account.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}
export default withStyles(styles)(Dashboard);
