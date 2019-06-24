import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import { Calendar, Day } from '@material-ui/pickers';
import axios from 'axios';
import chroma from 'chroma-js';
import Tooltip from '@material-ui/core/Tooltip';
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
import { attendance, colorMatcher, AttStat, asyncAttendance } from '../const/attendance';

const styles = theme => ({
	dayFullWrapper: {
		position: 'relative',
		width: '100%',
		height: '100%'
	}
});

const useMarkerStyles = makeStyles({
	root: {
		position: 'absolute',
		width: 16,
		height: 16,
		borderRadius: 12,
		right: 0,
		top: 0,
		transform: `scale(0.5)`
	}
});

function DateMarker({ status, attd }) {
	const classes = useMarkerStyles();
	const color = chroma(colorMatcher(status)).saturate(3);
	if (status === attendance.none) {
		return null;
	} else {
		return (
			<span
				className={classes.root}
				style={
					status === attendance.absence && attd.makeup_class_date === null
						? { border: `4px solid ${color}`, backgroundColor: '#fff' }
						: { backgroundColor: color, border: `4px solid ${color}` }
				}
			/>
		);
	}
}

function getDefaultMask(now) {
	let som = startOfMonth(now);
	let eom = endOfMonth(now);
	let sow = startOfWeek(som);
	let eow = endOfWeek(eom);
	let mask = new Array(differenceInDays(eom, som) + 1).fill(0);
	mask = mask.map((_, offset) => ({
		date: addDays(sow, offset),
		status: attendance.none,
		attd: {
			makeup_class_date: null,
			make_up_for: null
		}
	}));
	return [mask, som, eom, sow, eow];
}

function ClassCalendar({ classes, classroom, student }) {
	const [now, setNow] = useState(new Date());
	const [mask, setMask] = useState(getDefaultMask(now)[0]);
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();

	function cleanup() {
		source.cancel('canceled');
	}

	async function fetchClassAttendance(classroom, student) {
		const [defaultMask, som, eom, sow, eow] = getDefaultMask(now);

		const { data: attendanceList } = await axios({
			method: 'get',
			url: `/api/classrooms/${classroom}/attendance/`,
			cancelToken: source.token,
			params: {
				date__gte: format(som, 'yyyy-MM-dd'),
				date__lte: format(eom, 'yyyy-MM-dd'),
				student_id: student
			}
		});

		let ret = defaultMask;
		attendanceList.map(attd => {
			const offset = differenceInDays(new Date(attd.date), som);
			ret[offset].status = attendance[asyncAttendance[attd.status]];
			ret[offset].attd = attd;
		});
		setMask(ret);
	}

	function renderDay(day, selectedDate, dayInCurrentMonth, dayComponent) {
		let targetMask = mask.find(m => isSameDay(m.date, day)) || {
			status: attendance.none,
			attd: { makeup_class_date: null, make_up_for: null }
		};
		return (
			<Day current={false} hidden={!dayInCurrentMonth} selected={isSameDay(selectedDate, day)}>
				<DateMarker status={targetMask.status} attd={targetMask.attd} />
				{targetMask.status === attendance.absence ? (
					targetMask.attd.makeup_class_date !== null ? (
						<Tooltip
							title={`made up on ${format(new Date(targetMask.attd.makeup_class_date), 'MM-dd')}`}
							placement="top"
						>
							<span>{day.getDate()}</span>
						</Tooltip>
					) : (
						<Tooltip title={`not made up yet`} placement="top">
							<span>{day.getDate()}</span>
						</Tooltip>
					)
				) : targetMask.status === attendance.makeup && targetMask.attd.make_up_for !== null ? (
					<Tooltip
						title={`absent on ${format(new Date(targetMask.attd.make_up_for), 'MM-dd')}`}
						placement="top"
					>
						<span>{day.getDate()}</span>
					</Tooltip>
				) : (
					<span>{day.getDate()}</span>
				)}
			</Day>
		);
	}

	function onMonthChange(date) {
		setNow(date);
	}
	const onChange = value => {
		setNow(value);
	};

	useEffect(
		() => {
			fetchClassAttendance(classroom, student);
			return cleanup;
		},
		[now]
	);

	return <Calendar date={now} onChange={onChange} renderDay={renderDay} onMonthChange={onMonthChange} />;
}

export default withStyles(styles)(ClassCalendar);
