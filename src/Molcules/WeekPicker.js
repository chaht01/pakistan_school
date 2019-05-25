import React, { Fragment, PureComponent, useState } from 'react';
import clsx from 'clsx';
import format from 'date-fns/format';
import isValid from 'date-fns/isValid';
import isSameDay from 'date-fns/isSameDay';
import endOfWeek from 'date-fns/endOfWeek';
import startOfWeek from 'date-fns/startOfWeek';
import isWithinInterval from 'date-fns/isWithinInterval';
import withWidth, { isWidthUp } from '@material-ui/core/withWidth';
// @ts-ignore this guy required only on the docs site to work with dynamic date library
// import { cloneCrossUtils } from 'utils/helpers';
import { DatePicker, Calendar } from '@material-ui/pickers';
import { createStyles } from '@material-ui/styles';
import { IconButton, withStyles } from '@material-ui/core';
import DateRangeIcon from '@material-ui/icons/DateRange';

function CustomElements({ classes, width, selectedDate, handleSelectedDate, ...rest }) {
	const [open, setOpen] = useState(false);

	const toggleOpen = () => setOpen(!open);

	const handleWeekChange = date => {
		handleSelectedDate(startOfWeek(date));
	};

	const formatWeekSelectLabel = (date, invalidLabel) => {
		let dateClone = date;

		return dateClone && isValid(dateClone) ? `${format(startOfWeek(dateClone), 'MMM do')}` : invalidLabel;
	};

	const renderWrappedWeekDay = (date, selectedDate, dayInCurrentMonth) => {
		let dateClone = date;
		let selectedDateClone = selectedDate;

		const start = startOfWeek(selectedDateClone);
		const end = endOfWeek(selectedDateClone);

		const dayIsBetween = isWithinInterval(dateClone, { start, end });
		const isFirstDay = isSameDay(dateClone, start);
		const isLastDay = isSameDay(dateClone, end);

		const wrapperClassName = clsx({
			[classes.highlight]: dayIsBetween,
			[classes.firstHighlight]: isFirstDay,
			[classes.endHighlight]: isLastDay
		});

		const dayClassName = clsx(classes.day, {
			[classes.nonCurrentMonthDay]: !dayInCurrentMonth,
			[classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween
		});

		return (
			<div className={wrapperClassName}>
				<IconButton className={dayClassName}>
					<span> {format(dateClone, 'd')} </span>
				</IconButton>
			</div>
		);
	};

	return (
		<Fragment>
			<DatePicker
				value={selectedDate}
				onChange={handleWeekChange}
				renderDay={renderWrappedWeekDay}
				labelFunc={formatWeekSelectLabel}
				autoOk
				disableFuture
				open={open}
				component="span"
				InputProps={{
					className: classes.adjustedInput,
					disableUnderline: true,
					endAdornment: (
						<IconButton aria-label="Pick Week" onClick={toggleOpen}>
							<DateRangeIcon />
						</IconButton>
					)
				}}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				variant={isWidthUp('sm', width) ? 'inline' : 'dialog'}
				{...rest}
			/>
		</Fragment>
	);
}

const styles = createStyles(theme => ({
	adjustedInput: {
		maxWidth: '120px',
		[theme.breakpoints.down('sm')]: {
			'&>input': {
				width: 0
			}
		}
	},
	dayWrapper: {
		position: 'relative'
	},
	day: {
		width: 36,
		height: 36,
		fontSize: theme.typography.caption.fontSize,
		margin: '0 2px',
		color: 'inherit'
	},
	customDayHighlight: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: '2px',
		right: '2px',
		border: `1px solid ${theme.palette.secondary.main}`,
		borderRadius: '50%'
	},
	nonCurrentMonthDay: {
		color: theme.palette.text.disabled
	},
	highlightNonCurrentMonthDay: {
		color: '#676767'
	},
	highlight: {
		background: theme.palette.primary.main,
		color: theme.palette.common.white
	},
	firstHighlight: {
		extend: 'highlight',
		borderTopLeftRadius: '50%',
		borderBottomLeftRadius: '50%'
	},
	endHighlight: {
		extend: 'highlight',
		borderTopRightRadius: '50%',
		borderBottomRightRadius: '50%'
	}
}));

export default withWidth()(withStyles(styles)(CustomElements));
