import React from 'react';
import StopOutlined from '@material-ui/icons/StopOutlined';
import Remove from '@material-ui/icons/Remove';
import Record from '@material-ui/icons/FiberManualRecordOutlined';
import Clear from '@material-ui/icons/Clear';
import FormGroup from '@material-ui/core/FormGroup';
import { withStyles } from '@material-ui/styles';
import { attendance, colorMatcher, attendMask } from '../const/attendance';

const styles = {
	root: {
		width: '100%',
		flexShrink: 0
	}
};

// const bulletStyles = theme => ({
//   root: {
//     width: theme.spacing(1),
//     [theme.breakpoints.down('sm')]: {
//       backgroundColor: theme.palette.secondary.main,
//     },
//     [theme.breakpoints.up('md')]: {
//       backgroundColor: theme.palette.primary.main,
//     },
//     [theme.breakpoints.up('lg')]: {
//       backgroundColor: green[500],
//     },
//   },
// });

// const StyeldFormGroup = withStyles(FormStyles)(FormGroup);

const AttendBulletItem = withStyles(theme => ({
	root: {
		width: `${100 / 7}%`,
		position: 'relative'
	},
	inner: {
		position: 'relative',
		width: '100%',
		paddingTop: '100%'
	},
	active: {
		boxShadow: 'inset 0 0 0 4px black'
	}
}))(function({ state, active, classes, mask }) {
	return (
		<div
			className={`${classes.root} ${active ? classes.active : ''}`}
			style={{ backgroundColor: colorMatcher(state, active ? 1.0 : 0.6, mask) }}
		>
			<div className={classes.inner} />
		</div>
	);
});

function AttendBullet({ states, classes, mask = attendMask }) {
	return (
		<FormGroup row={true} className={classes.root}>
			{states.map((state, i) => {
				return <AttendBulletItem state={state} mask={mask} active={i === new Date().getDay()} />;
			})}
		</FormGroup>
	);
}

export default withStyles(styles)(AttendBullet);
