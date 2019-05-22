import React, { useState, useEffect, Fragment } from 'react';
import AbsenceDialog from '../Organism/AbsenceDialog';
import AttendCard from '../Molcules/AttendCard';
import { attendance } from '../const/attendance';

export default function AbsenceDate({ initStat, name, targetDate, onChage }) {
	const [attendanceValue, setAttendanceValue] = useState(initStat);
	const [open, setOpen] = useState(false);
	const [pos, setPos] = useState({ left: 0, top: 0, right: 0, bottom: 0 });
	function handleClickOpen(e) {
		setPos(e.target.getBoundingClientRect());
		setOpen(true);
	}

	function handleClose(value) {
		setAttendanceValue(value);
		setOpen(false);
	}

	return (
		<Fragment>
			<AttendCard tabindex="-1" status={attendanceValue} elevated={open} onClick={handleClickOpen}>
				{attendanceValue.data && attendanceValue.dataToString()}
			</AttendCard>
			<AbsenceDialog
				attendanceValue={attendanceValue}
				open={open}
				name={name}
				targetDate={targetDate}
				onClose={handleClose}
				pos={pos}
			/>
		</Fragment>
	);
}
