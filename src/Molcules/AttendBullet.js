import React from 'react';
import StopOutlined from '@material-ui/icons/StopOutlined';
import Remove from '@material-ui/icons/Remove';
import Record from '@material-ui/icons/FiberManualRecordOutlined';
import Clear from '@material-ui/icons/Clear';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/styles';

import { attendance } from '../const/attendance';

const FormStyles = {
	root: {
		width: 150,
		flexShrink: 0
	}
};
const StyeldFormGroup = withStyles(FormStyles)(FormGroup);

const attendMask = {
	[attendance.attended]: Record,
	[attendance.absence]: Clear,

	[attendance.none]: Remove,
	[attendance.scheduled]: StopOutlined
};

export default function AttendBullet({ states }) {
	return (
		<StyeldFormGroup row={true}>
			{states.map((state, i) => {
				const StateComp = attendMask[state];
				return (
					<StateComp key={i} fontSize="small" style={{ opacity: i === new Date().getDay() - 1 ? 1 : 0.5 }} />
				);
			})}
		</StyeldFormGroup>
	);
}
