import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Stop from '@material-ui/icons/Stop';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/styles';
import { foreground } from '../const/colors';
import FormLabel from '@material-ui/core/FormLabel';

const Checkstyles = {
	root: {
		padding: 0,
		color: foreground.gray,
		'&$checked': {
			color: foreground.cobalt
		}
	},
	checked: {}
};
const FormStyles = {
	root: {
		margin: '0 auto',
		flexShrink: 0
	}
};
const StyledCheckbox = withStyles(Checkstyles)(Checkbox);

const StyeldFormGroup = withStyles(FormStyles)(FormGroup);

export function ScheduleBulletControl({ editable = false, initDays = [0, 0, 0, 0, 0, 0, 0] }) {
	const weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
	const [checked, setChecked] = useState(initDays.map(v => v === 1));
	function changeValue(e, i, j) {
		if (!editable) return;
		setChecked(
			checked.map((v, idx) => {
				if (idx === i) {
					return !v;
				}
				return v;
			})
		);
	}
	return (
		<StyeldFormGroup row={true}>
			{weekdays.map((w, i) => (
				<Tooltip key={w} title={w} placement="bottom">
					<StyledCheckbox
						icon={<Stop fontSize="large" />}
						checkedIcon={<Stop fontSize="large" />}
						checked={checked[i]}
						onChange={e => changeValue(e, i)}
					/>
				</Tooltip>
			))}
		</StyeldFormGroup>
	);
}

ScheduleBulletControl.propTypes = {
	editable: PropTypes.bool,
	initDays: PropTypes.array
};

export default function ScheduleButllet({ label, editable, initDays, ...rest }) {
	return (
		<FormControl margin="dense" required {...rest}>
			{label && <InputLabel shrink={true}>{label}</InputLabel>}
			<Input
				inputComponent={ScheduleBulletControl}
				inputProps={{ editable: true, initDays: [1, 0, 1, 0, 1, 0, 0], ...editable, ...initDays }}
				disableUnderline={true}
			/>
		</FormControl>
	);
}
