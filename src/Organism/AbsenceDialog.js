import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import blue from '@material-ui/core/colors/blue';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import Tooltip from '@material-ui/core/Tooltip';
import { attendance, colorMatcher, AttStat, asyncAttendance } from '../const/attendance';
import { foreground } from '../const/colors';
import AttendCard from '../Molcules/AttendCard';
import styled from 'styled-components';
import chroma from 'chroma-js';
import axios from 'axios';
import {
	startOfMonth,
	endOfMonth,
	format,
	isSameDay,
	startOfWeek,
	endOfWeek,
	differenceInDays,
	addDays,
	isBefore
} from 'date-fns';
import { TimePicker, DatePicker, Day } from '@material-ui/pickers';

const styles = {
	avatar: {
		backgroundColor: blue[100],
		color: blue[600]
	}
};

const radioStyle = {
	root: {},
	checked: {},
	[attendance.attended]: {
		color: foreground.emerald,
		'&$checked': {
			color: foreground.emerald
		}
	},

	[attendance.late]: {
		color: foreground.yellow,
		'&$checked': {
			color: foreground.yellow
		}
	},
	[attendance.absence]: {
		color: foreground.red,
		'&$checked': {
			color: foreground.red
		}
	},
	[attendance.makeup]: {
		color: foreground.purple,
		'&$checked': {
			color: foreground.purple
		}
	},
	[attendance.none]: {
		color: foreground.gray,
		'&$checked': {
			color: foreground.gray
		}
	}
};

const FloatedAttendCard = styled(AttendCard)`
	position: fixed;
	left: ${props => props.x}px;
	top: ${props => props.y}px;
	width: ${props => props.width}px;
	height: ${props => props.height}px;
`;

function AttendanceSelection({ value = attendance.attended, handleChange, handleClose, classes }) {
	const mask = [attendance.attended, attendance.late, attendance.absence, attendance.makeup, attendance.none];
	return (
		<div>
			{mask.map((state, idx) => (
				<Tooltip title={state.split('/')[1]} key={idx} placement="top">
					<Radio
						checked={value === state}
						onChange={handleChange}
						value={state}
						name="stat"
						aria-label="state"
						color="default"
						classes={{
							root: classes[state],
							checked: `${classes[state]}.checked`
						}}
					/>
				</Tooltip>
			))}
		</div>
	);
}

function PaperComponent({ pos: { x, y, width, height }, attObj, ...other }) {
	const style = {
		root: {
			position: 'absolute',
			width: 288,
			margin: 0,
			zIndex: 1,
			left: (() => {
				if (window.innerWidth < 500) {
					return window.innerWidth / 2 - 144;
				}
				let cand = Math.max(x, window.innerWidth - (x + width));
				let bit = x < window.innerWidth - (x + width) ? 1 : 0;
				if (cand < 294) {
					return x + width / 2 - 144;
				} else {
					if (bit === 0) {
						return x - 294;
					} else {
						return x + width + 6;
					}
				}
			})()
		}
	};

	const StyledPaper = withStyles(style)(Paper);
	const [att, setAtt] = useState(new AttStat(attObj.stat, { date: attObj.date, remote: attObj.remote }));
	return (
		<Fragment>
			<FloatedAttendCard status={attObj} elevated={true} x={x} y={y} width={width} height={height}>
				{att.date && att.dateToString()}
			</FloatedAttendCard>
			<StyledPaper {...other} />
		</Fragment>
	);
}

const materialTheme = color =>
	createMuiTheme({
		overrides: {
			MuiPickersToolbar: {
				toolbar: {
					backgroundColor: color
				}
			},
			MuiPickersClock: {
				pin: {
					backgroundColor: color
				}
			},
			MuiPickersClockPointer: {
				pointer: {
					backgroundColor: color
				},
				noPoint: {
					backgroundColor: color
				},
				thumb: {
					backgroundColor: color,
					borderColor: color
				}
			},

			MuiPickersDay: {
				day: {
					color: foreground.red
				},
				daySelected: {
					backgroundColor: color,
					'&:hover': {
						backgroundColor: chroma(color)
							.darken(0.5)
							.css()
					}
				},
				current: {
					color
				}
			}
		}
	});

function getDefaultMask(now) {
	let som = startOfMonth(now);
	let eom = endOfMonth(now);
	let sow = startOfWeek(som);
	let eow = endOfWeek(eom);
	let mask = new Array(differenceInDays(eow, sow) + 1).fill(0);
	mask = mask.map((_, offset) => ({
		checked: false,
		date: addDays(sow, offset)
	}));
	return [mask, som, eom, sow, eow];
}

function MakeUpPicker({ student, classroom, value, handleChange, targetDate, reportError }) {
	const [now, setNow] = useState(targetDate);
	const [mask, setMask] = useState(getDefaultMask(now)[0]);
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	function cleanup() {
		source.cancel('canceled');
	}
	useEffect(
		() => {
			async function getDayMask(now) {
				const [defaultMask, som, eom, sow, eow] = getDefaultMask(now);
				const { data: attendanceList } = await axios({
					method: 'get',
					url: `/api/classrooms/${classroom}/attendance/`,
					cancelToken: source.token,
					params: {
						date__gte: format(sow, 'yyyy-MM-dd'),
						date__lte: format(eow, 'yyyy-MM-dd'),
						student_id: student
					}
				});

				const absences = attendanceList.filter(
					val =>
						isBefore(new Date(val.date), targetDate) &&
						attendance[asyncAttendance[val.status]] === attendance.absence &&
						(val.makeup_class_date === null || isSameDay(new Date(val.makeup_class_date), targetDate))
				);
				console.log(absences);
				let ret = defaultMask;
				absences.map(abs => {
					const offset = differenceInDays(new Date(abs.date), sow);
					// console.log(offset);
					ret[offset].checked = true;
				});
				setMask(ret);
			}
			getDayMask(now);
			return cleanup;
		},
		[now]
	);

	function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
		let targetMask = mask.find(m => isSameDay(m.date, day));
		return (
			<Day
				disabled={!targetMask ? true : !targetMask.checked}
				current={false}
				hidden={!dayInCurrentMonth}
				selected={isSameDay(selectedDate, day)}
			>
				{day.getDate()}
			</Day>
		);
	}

	function onMonthChange(date) {
		setNow(date);
	}

	function checkValidDate(value) {
		let targetMask = mask.find(m => isSameDay(m.date, value));
		if (!targetMask || !targetMask.checked) {
			return false;
		}
		return true;
	}
	return (
		<ThemeProvider theme={materialTheme(colorMatcher(attendance.makeup))}>
			<DatePicker
				margin="normal"
				label="Make up for"
				name="data"
				value={value}
				onChange={value => {
					handleChange({ target: { name: 'date', value } });
					reportError(!checkValidDate(value));
				}}
				showTodayButton={true}
				disableFuture={true}
				onMonthChange={onMonthChange}
				renderDay={renderDay}
				error={!checkValidDate(value)}
				helperText={!checkValidDate(value) && `Invalid Absent Date`}
			/>
		</ThemeProvider>
	);
}

function AttendanceDetail({ attObj, student, classroom, handleChange, targetDate, reportError }) {
	const { stat, date, remote } = attObj;
	const [selectedTime, handleTime] = useState(date);
	const onClose = () => {
		handleChange({ target: { name: 'date', value: selectedTime } });
	};
	if (stat === attendance.late) {
		return (
			<ThemeProvider theme={materialTheme(colorMatcher(attendance.late))}>
				<TimePicker
					margin="normal"
					label="Late at"
					value={selectedTime}
					name="date"
					onChange={handleTime}
					onClose={onClose}
				/>
			</ThemeProvider>
		);
	} else if (stat === attendance.makeup) {
		return (
			<MakeUpPicker
				value={date}
				targetDate={targetDate}
				classroom={classroom}
				student={student}
				handleChange={handleChange}
				reportError={reportError}
			/>
		);
	} else {
		return null;
	}
}

function SimpleDialog({ name, student, classroom, targetDate, onClose, attendanceValue, classes, pos, ...other }) {
	const [attObj, updateAttObj] = useState({
		stat: attendanceValue.stat,
		date: attendanceValue.date,
		remote: attendanceValue.remote
	});

	const [detailError, setDetailError] = useState(false);

	function onEnter() {
		updateAttObj({
			stat: attendanceValue.stat,
			date: attendanceValue.date,
			remote: attendanceValue.remote
		});
	}

	function handleAttendanceChange(event) {
		updateAttObj({
			...attObj,
			[event.target.name]: event.target.value
		});
	}

	function handleClose(e, reason) {
		if (reason === 'escapeKeyDown') {
			handleCancel();
		} else {
			console.log(attObj);
			onClose(new AttStat(attObj.stat, { date: attObj.date, remote: attObj.remote }));
		}
	}

	function handleCancel() {
		onClose();
		setDetailError(false); //reinitialize
	}

	const StyledAttendanceSelection = withStyles(radioStyle)(AttendanceSelection);

	return (
		<Dialog
			onEnter={onEnter}
			onClose={handleClose}
			aria-labelledby="simple-dialog-title"
			PaperComponent={props => <PaperComponent pos={pos} attObj={attObj} {...props} />}
			maxWidth={'xs'}
			{...other}
		>
			<DialogTitle id="simple-dialog-title">{name}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{`${targetDate.toLocaleString('en-us', { month: 'long' })} ${targetDate.toLocaleString('en-us', {
						day: 'numeric'
					})}`}
				</DialogContentText>
				<StyledAttendanceSelection value={attObj.stat} handleChange={handleAttendanceChange} />
				<AttendanceDetail
					attObj={attObj}
					handleChange={handleAttendanceChange}
					student={student}
					classroom={classroom}
					targetDate={targetDate}
					reportError={setDetailError}
				/>
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="default">
					Cancel
				</Button>
				<Button onClick={handleClose} color="primary" autoFocus disabled={detailError}>
					Confirm
				</Button>
			</DialogActions>
		</Dialog>
	);
}

SimpleDialog.propTypes = {
	classes: PropTypes.object.isRequired,
	onClose: PropTypes.func,
	selectedValue: PropTypes.string
};

export default withStyles(styles)(SimpleDialog);
