import React, { Fragment, useState, useEffect } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles, createMuiTheme, responsiveFontSizes, MuiThemeProvider } from '@material-ui/core/styles';
import { withRouter } from 'react-router';
import { DateConsumer } from '../Context/DateContext';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Statbar from '../Organism/Statbar';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Calendar from '../Organism/Calendar';
import { base } from '../const/size';
import { foreground, fonts } from '../const/colors';
import SettingsIcon from '@material-ui/icons/Settings';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import format from 'date-fns/format';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { defaultRoute } from '../const/auth';
import { match } from 'autosuggest-highlight/match';
import { attendance, asyncAttendance, AttStat } from '../const/attendance';
import { differenceInDays, addDays } from 'date-fns';

const defaultTheme = createMuiTheme();
let theme = createMuiTheme({
	overrides: {
		MuiListItemText: {
			primary: {
				...responsiveFontSizes(defaultTheme).typography.h4,
				lineHeight: 1,
				textTransform: 'capitalize'
			},
			secondary: {
				lineHeight: 1
			}
		}
	}
});
theme = responsiveFontSizes(theme);

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
	},
	settingsIcon: {
		marginRight: theme.spacing(1)
	}
});

function ClassRoom({ classes, title, lecturers = [], absences, match, range: [startDate, endDate] }) {
	const { params: { classId }, path } = match;
	const [classrooms, setClassrooms] = useState([]);
	const [selectedClassroom, setSelectedClassroom] = useState(classId > 0 ? Number(classId) : -1);
	const [building, setBuilding] = useState(-1);
	const [targetClass, setTargetClass] = useState(null);
	useEffect(
		() => {
			const CancelToken = axios.CancelToken;
			const source = CancelToken.source();
			function cleanup() {
				source.cancel('canceled');
			}
			async function fetchClassRoom() {
				const { data: classrooms } = await axios({
					method: 'get',
					url: '/api/classrooms/',
					cancelToken: source.token
				});
				setClassrooms(classrooms);

				const targetClass = classrooms.find(classroom => classroom.id == classId);

				if (!targetClass) {
					setSelectedClassroom(-1);
					setTargetClass(null);
				} else {
					setBuilding(targetClass.building);
					const targetClass_with_schedule = {
						...targetClass,
						schedule: {
							initDays: (lessons => {
								let ret = [0, 0, 0, 0, 0, 0, 0];
								const mask = [
									'Sunday',
									'Monday',
									'Tuesday',
									'Wednesday',
									'Thursday',
									'Friday',
									'Saturday'
								];
								lessons.map(lesson => (ret[mask.indexOf(lesson['day_of_week'])] = 1));
								return ret;
							})(targetClass.lessons),
							startTime: (targetClass.lessons[0] || { start_time: '10:00' }).start_time,
							endTime: (targetClass.lessons[0] || { end_time: '13:00' }).end_time
						}
					};

					const { attended, none, absence, scheduled, makeup, late } = attendance;

					const { id, schedule, ...rest } = targetClass_with_schedule;

					const { initDays } = schedule;
					let { data: attendances } = await axios({
						method: 'get',
						url: `/api/classrooms/${id}/attendance/`,
						cancelToken: source.token,
						params: {
							date__gte: format(startDate, 'yyyy-MM-dd'),
							date__lte: format(endDate, 'yyyy-MM-dd')
						}
					});
					let arrangeByStudent = {};
					targetClass.students.map(student => {
						const { id: studentId, profile: { name } } = student;
						if (!(studentId in arrangeByStudent)) {
							arrangeByStudent[studentId] = {
								name,
								student,
								absenceStatus: initDays.map(val => new AttStat(none))
							};
						}
					});
					attendances.map(attd => {
						const offset = differenceInDays(new Date(attd.date), startDate);
						const currentStatus = attendance[asyncAttendance[attd.status]];
						const cat_status = [late, makeup].indexOf(currentStatus);
						arrangeByStudent[attd.student]['absenceStatus'][offset] = new AttStat(currentStatus, {
							date:
								cat_status > -1
									? cat_status === 0
										? (() => {
												let d = addDays(startDate, offset);
												let tokens = attd.clock_in_time.split(':');
												d.setHours(tokens[0]);
												d.setMinutes(tokens[1]);
												return d;
											})()
										: new Date(attd.make_up_for)
									: null,
							remote: attd
						});
					});

					let absences = Object.entries(arrangeByStudent).map(([id, attendanceStatus]) => ({
						id,
						...attendanceStatus
					}));
					const processed_targetClass = {
						id,
						schedule,
						absences,
						...rest
					};
					setSelectedClassroom(targetClass.id);
					setTargetClass(processed_targetClass);
				}
			}
			fetchClassRoom();
			return cleanup;
		},
		[startDate, endDate, classId]
	);

	const handleChange = event => {
		setSelectedClassroom(oldValues => event.target.value);
	};

	return (
		<Fragment>
			<DateConsumer>
				{({ globalNow: selectedDate }) => (
					<Statbar
						building={building}
						classroom={selectedClassroom}
						adornment={
							<MuiThemeProvider theme={theme}>
								<Grid container alignItems="center" spacing={6}>
									<Grid item>
										<FormControl className={classes.formControl}>
											<Select
												value={selectedClassroom}
												autoWidth
												displayEmpty
												name="class"
												onChange={handleChange}
											>
												{classrooms.map(b => {
													return (
														<MenuItem
															key={b.id}
															value={b.id}
															component={Link}
															to={`/classroom/${b.id}/`}
														>
															<ListItemText
																primary={b.name}
																secondary={`${b.lessons.length > 0
																	? `${b.lessons[0].start_time.slice(
																			0,
																			-3
																		)} ~ ${b.lessons[0].end_time.slice(0, -3)}`
																	: ``}`}
															/>
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</Grid>
									<Hidden smDown>
										<Grid item>
											<Grid container direction="column" alignItems="center">
												<Grid item>
													<Typography variant="body">{lecturers[0]}</Typography>
													{lecturers.length > 1 && (
														<Fragment>
															<Typography variant="caption">{`  and  `}</Typography>
															<IconButton size="small" color="default">
																<Typography variant="caption">
																	+{lecturers.length - 1}
																</Typography>
															</IconButton>
														</Fragment>
													)}
												</Grid>
												<Grid item>
													<MuiThemeProvider
														theme={createMuiTheme({
															palette: {
																primary: {
																	main: fonts.gray
																}
															}
														})}
													>
														{targetClass !== null && (
															<Button
																variant="outlined"
																size="small"
																color="primary"
																component={Link}
																to={`/manageclass/${targetClass.id}`}
															>
																<SettingsIcon className={classes.settingsIcon} />
																Manage
															</Button>
														)}
													</MuiThemeProvider>
												</Grid>
											</Grid>
										</Grid>
									</Hidden>
								</Grid>
							</MuiThemeProvider>
						}
						current={selectedDate}
					>
						<Calendar
							classroom={selectedClassroom > 0 ? selectedClassroom : -1}
							absences={targetClass ? targetClass.absences : []}
							startDate={startDate}
							endDate={endDate}
							classrooms={classrooms}
							initDays={targetClass ? targetClass.schedule.initDays : [0, 0, 0, 0, 0, 0]}
						/>
					</Statbar>
				)}
			</DateConsumer>
		</Fragment>
	);
}

ClassRoom.propTypes = {
	title: PropTypes.string.isRequired,
	lecturers: PropTypes.string.isRequired,
	schedule: PropTypes.shape({
		initDays: PropTypes.array,
		startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
		endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number])
	}).isRequired,
	absences: PropTypes.array.isRequired
};

export default withRouter(withStyles(styles)(ClassRoom));
