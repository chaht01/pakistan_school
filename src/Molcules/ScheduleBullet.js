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
import { SizeMe } from 'react-sizeme';

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

export function ScheduleBulletControl({ editable = false, initDays = [0, 0, 0, 0, 0, 0, 0], handleDays }) {
	const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	function changeValue(e, i, j) {
		if (!editable) return;
		const updated = initDays.map((v, idx) => {
			if (idx === i) {
				return !v;
			}
			return v;
		});
		handleDays(updated);
	}
	return (
		<SizeMe>
			{({ size }) => {
				return (
					<StyeldFormGroup row={true}>
						{weekdays.map((w, i) => (
							<Tooltip key={w} title={w} placement="bottom">
								<StyledCheckbox
									icon={<Stop fontSize={size.width >= 245 ? 'large' : 'default'} />}
									checkedIcon={<Stop fontSize={size.width >= 245 ? 'large' : 'default'} />}
									checked={initDays[i]}
									onChange={e => changeValue(e, i)}
								/>
							</Tooltip>
						))}
					</StyeldFormGroup>
				);
			}}
		</SizeMe>
	);
}

ScheduleBulletControl.propTypes = {
	editable: PropTypes.bool,
	initDays: PropTypes.array
};

export default function ScheduleBullet({ label, editable, initDays, handleDays, ...rest }) {
	return (
		<FormControl margin="dense" required>
			{label && (
				<InputLabel shrink={true} {...rest}>
					{label}
				</InputLabel>
			)}
			<Input
				inputComponent={ScheduleBulletControl}
				inputProps={{ editable, initDays, handleDays, ...rest }}
				disableUnderline={true}
			/>
		</FormControl>
	);
}
