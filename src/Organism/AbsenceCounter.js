import React, { useState, useEffect, Fragment } from 'react';
import HorizonLabelGroup from '../Molcules/HorizonLabelGroup';

export default function AbsenceCounter({ range = [], classes = [] }) {
	const [absence, setAbsence] = useState(0);

	let rangeString;
	if (range.length === 0) {
		let start = new Date();
		start.setDate(start - (start.getDay() - 1));
		range = [start, start + 7];
		rangeString = 'Weekly';
	}

	useEffect(() => {});

	return (
		<HorizonLabelGroup
			big={absence}
			small={
				<Fragment>
					{`${rangeString}`}
					<br />Absence
				</Fragment>
			}
		/>
	);
}
