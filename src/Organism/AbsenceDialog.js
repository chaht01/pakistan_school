import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core';

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
import { attendance, colorMatcher, AttStat } from '../const/attendance';
import { foreground } from '../const/colors';
import AttendCard from '../Molcules/AttendCard';
import styled from 'styled-components';
import chroma from 'chroma-js';

import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

const emails = [
	'username@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.comusername@gmail.com',
	'user02@gmail.com'
];
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
			{mask.map(state => (
				<Tooltip title={state.split('/')[1]} placement="top">
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
	let tmpAttObj = new AttStat(attObj.stat, attObj.data);
	return (
		<Fragment>
			<FloatedAttendCard status={attObj} elevated={true} x={x} y={y} width={width} height={height}>
				{tmpAttObj.data && tmpAttObj.dataToString()}
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
				isSelected: {
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
			},
			MuiPickersModal: {
				dialogAction: {
					color
				}
			}
		}
	});

function MakeUpPicker({ value, handleChange }) {
	const now = new Date();
	const getDayMaskRand = (year, month) => {
		return new Array(31).fill(0).map(_ => {
			if (Math.random() < 0.5) {
				return 1;
			} else {
				return 0;
			}
		});
	};
	const [mask, setMask] = useState(getDayMaskRand(now.getYear(), now.getMonth() + 1));

	function onMonthChange(date) {
		setMask(getDayMaskRand(date.getYear(), date.getMonth() + 1));
	}
	return (
		<MuiThemeProvider theme={materialTheme(colorMatcher(attendance.makeup))}>
			<DatePicker
				margin="normal"
				label="Make up for"
				name="data"
				value={value}
				onChange={value => handleChange({ target: { name: 'data', value } })}
				showTodayButton={true}
				autoOk
				disableFuture={true}
				onMonthChange={onMonthChange}
				shouldDisableDate={day => {
					if (mask[day.getDate() - 1] === 1) return false;
					return true;
				}}
			/>
		</MuiThemeProvider>
	);
}

function AttendanceDetail({ attObj, handleChange }) {
	const { stat, data } = attObj;

	if (stat === attendance.late) {
		return (
			<MuiThemeProvider theme={materialTheme(colorMatcher(attendance.late))}>
				<TimePicker
					margin="normal"
					label="Late at"
					value={data}
					name="data"
					onChange={value => handleChange({ target: { name: 'data', value } })}
				/>
			</MuiThemeProvider>
		);
	} else if (stat === attendance.makeup) {
		return <MakeUpPicker value={data} handleChange={handleChange} />;
	} else {
		return null;
	}
}

function SimpleDialog({ name, targetDate, onClose, attendanceValue, classes, pos, ...other }) {
	const [attObj, updateAttObj] = useState({
		stat: attendanceValue.stat,
		data: attendanceValue.data || new Date()
	});

	function onEnter() {
		updateAttObj({
			stat: attendanceValue.stat,
			data: attendanceValue.data || new Date()
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
			onClose(new AttStat(attObj.stat, attObj.data));
		}
	}

	function handleCancel() {
		onClose(attendanceValue);
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
				<AttendanceDetail attObj={attObj} handleChange={handleAttendanceChange} />
			</DialogContent>
			<DialogActions>
				<Button onClick={handleCancel} color="default">
					Cancel
				</Button>
				<Button onClick={handleClose} color="primary" autoFocus>
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
