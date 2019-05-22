import React, { Fragment, useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import WeekPicker from '../Molcules/WeekPicker';

function DateTime() {
	const [date, setDate] = useState(new Date());

	useEffect(() => {
		var timerID = setInterval(() => tick(), 1000);

		return function cleanup() {
			clearInterval(timerID);
		};
	});

	function tick() {
		setDate(new Date());
	}

	return (
		<Typography variant="button">
			{date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
		</Typography>
		// <HorizonLabelGroup
		// 	reverse={true}
		// 	big={}
		// 	small={
		// 		<Fragment>
		// 			{`${date.toLocaleString('en-us', { month: 'long' })} ${date.toLocaleString('en-us', {
		// 				day: 'numeric'
		// 			})}`}
		// 			<br />
		// 			{`${date.toLocaleString('en-us', { year: 'numeric' })}`}
		// 		</Fragment>
		// 	}
		// />
	);
}

function DateController({ size: { width } }) {
	return (
		<Fragment>
			<Button variant="outlined" size="small">
				Today
			</Button>
			<IconButton aria-label="Prev Week" size="small">
				<ChevronLeftIcon />
			</IconButton>
			<IconButton aria-label="Prev Week" size="small">
				<ChevronRightIcon />
			</IconButton>
			<WeekPicker variant="inline" />
			<DateTime />
		</Fragment>
	);
}

export default withSize()(DateController);
