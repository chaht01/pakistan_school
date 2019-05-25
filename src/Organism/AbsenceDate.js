import React, { useState, useEffect, Fragment } from 'react';
import AbsenceDialog from '../Organism/AbsenceDialog';
import AttendCard from '../Molcules/AttendCard';
import { attendance, reverseAsyncAttendance, AttStat } from '../const/attendance';
import axios from 'axios';
import format from 'date-fns/format';

export default function AbsenceDate({ initStat, student, classroom, name, targetDate, onChage }) {
	const { attended, late, absence, makeup, none } = attendance;
	const [attendanceValue, setAttendanceValue] = useState(initStat);
	const [open, setOpen] = useState(false);
	const [pos, setPos] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
	function handleClickOpen(e) {
		setPos(e.target.getBoundingClientRect());
		setOpen(true);
	}
	async function handleClose(value) {
		if (value) {
			//update only if value is given
			const { stat, date, remote } = value;
			if (remote === null) {
				if (stat !== attendanceValue.stat) {
					const {
						data: resolved
					} = await axios.post(`/api/classrooms/${classroom}/attendance/`, {
						student,
						status: reverseAsyncAttendance[stat],
						date: format(targetDate, 'yyyy-MM-dd'),
						classroom: classroom
					});
					setAttendanceValue(new AttStat(stat, { date, remote: resolved }));
				}
			} else {
				if (stat === none) {
					await axios.delete(`/api/classrooms/${classroom}/attendance/${remote.id}`);
					setAttendanceValue(new AttStat(stat, { date: null, remote: null }));
				} else if (stat === late) {
					const {
						data: resolved
					} = await axios.patch(
						`/api/classrooms/${classroom}/attendance/${remote.id}/`,
						{
							status: reverseAsyncAttendance[stat],
							clock_in_time: `${format(date, 'hh:mm')}:00`
						}
					);
					setAttendanceValue(new AttStat(stat, { date, remote: resolved }));
				} else if (stat === absence) {
					const {
						data: resolved
					} = await axios.patch(
						`/api/classrooms/${classroom}/attendance/${remote.id}/`,
						{
							status: reverseAsyncAttendance[stat]
						}
					);
					setAttendanceValue(new AttStat(stat, { date, remote: resolved }));
				} else if (stat === makeup) {
					const {
						data: resolved
					} = await axios.patch(
						`/api/classrooms/${classroom}/attendance/${remote.id}/`,
						{
							status: reverseAsyncAttendance[stat],
							make_up_for: format(date, 'yyyy-MM-dd')
						}
					);
					setAttendanceValue(new AttStat(stat, { date, remote: resolved }));
				}
			}
		}
		console.log(attendanceValue);
		setOpen(false);
	}

	return (
		<Fragment>
			<AttendCard tabindex="-1" status={attendanceValue} elevated={open} onClick={handleClickOpen}>
				{attendanceValue.date && attendanceValue.dateToString()}
			</AttendCard>
			<AbsenceDialog
				attendanceValue={attendanceValue}
				open={open}
				name={name}
				student={student}
				classroom={classroom}
				targetDate={targetDate}
				onClose={handleClose}
				pos={pos}
			/>
		</Fragment>
	);
}
