import React, { Fragment, useState, useEffect } from 'react';
import { styled as styledUI } from '@material-ui/styles';
import styled from 'styled-components';
import { withStyles } from '@material-ui/core/styles';
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
import axios from 'axios';

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
		margin: theme.spacing(1),
		width: '100%',
		[theme.breakpoints.down('sm')]: {
			maxWidth: 120
		},
		[theme.breakpoints.up('sm')]: {
			maxWidth: 200
		},
		[theme.breakpoints.up('md')]: {
			maxWidth: 200
		},
		[theme.breakpoints.up('lg')]: {
			maxWidth: 200
		}
	}
});

function Dashboard({ classes, range: [startDate, endDate] }) {
	const { attended, none, absence, scheduled, makeup } = attendance;
	const [classInfo, setClassInfo] = useState([]);
	const [timer, setTimer] = useState(new Date());
	const [buildings, setBuildings] = useState([]);
	const [building, setBuilding] = useState(-1);
	const handleChange = event => {
		setBuilding(oldValues => event.target.value);
	};

	function tick() {
		setTimer(new Date());
	}

	useEffect(() => {
		async function fetchBuildings() {
			const { data } = await axios({ method: 'get', url: 'http://teaching.talk4u.kr/api/buildings/' });
			setBuildings(data);
			setBuilding(data[0].id);
		}
		fetchBuildings();
	}, []);

	useEffect(
		() => {
			var timerID = setInterval(() => tick(), 3000);
			async function fetchClassRoom() {
				const { data: classrooms } = await axios({
					method: 'get',
					url: 'http://teaching.talk4u.kr/api/classrooms/',
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
						startTime: (info.lessons[0] || { start_time: '10:00' }).start_time,
						endTime: (info.lessons[0] || { end_time: '13:00' }).end_time
					}
				}));

				const processed = await Promise.all(
					classrooms_with_schedule.map(async ({ id, schedule, ...rest }) => {
						const { initDays } = schedule;
						let { data: attendances } = await axios({
							method: 'get',
							url: `http://teaching.talk4u.kr/api/classrooms/${id}/attendance/`,
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
				setClassInfo(processed);
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
			<Statbar
				adornment={
					<FormControl className={classes.formControl}>
						<Select value={building} autoWidth displayEmpty name="building" onChange={handleChange}>
							{buildings.map(b => <MenuItem value={b.id}>{b.name}</MenuItem>)}
						</Select>
					</FormControl>
				}
			>
				<PreviewStepper classInfo={classInfo} />
			</Statbar>
		</Fragment>
	);
}
export default withStyles(styles)(Dashboard);
