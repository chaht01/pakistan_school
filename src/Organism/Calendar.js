import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import AbsenceDate from '../Organism/AbsenceDate';
import { createMuiTheme, responsiveFontSizes, withStyles } from '@material-ui/core/styles';
import { foreground, fonts } from '../const/colors';
import Typography from '@material-ui/core/Typography';
import { attendance, colorMatcher, scheduleMask } from '../const/attendance';
import { ThemeProvider } from '@material-ui/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Hidden from '@material-ui/core/Hidden';
import Paper from '@material-ui/core/Paper';
import format from 'date-fns/format';

const defaultTheme = createMuiTheme();
let theme = responsiveFontSizes(defaultTheme);
const calendarRow = {
	display: 'grid',
	gridTemplateColumns: '240px repeat(7, 1fr)',
	[theme.breakpoints.down('md')]: {
		gridTemplateColumns: '180px repeat(7, 1fr)'
	},
	[theme.breakpoints.down('sm')]: {
		gridTemplateColumns: '100px repeat(7, 1fr)'
	}
};

const styles = theme => ({
	calendarRow,
	weekDaysHeader: {
		...calendarRow,
		position: 'fixed',
		width: '100%',
		left: 0,
		background: foreground.white,
		height: 80,
		zIndex: 99
	},
	weekDay: {
		position: 'relative',
		'&:before': {
			position: 'absolute',
			display: 'block',
			content: "''",
			left: '100%',
			bottom: 0,
			height: 20,
			width: 1,
			backgroundColor: fonts.darkGray,
			transform: 'translateX(-50%)',
			opacity: 0.5
		}
	},
	scheduled: {
		backgroundColor: colorMatcher(attendance.scheduled, 0.6, scheduleMask),
		color: fonts.white
	},
	today: {
		position: 'relative',
		'&:after': {
			content: '""',
			position: 'absolute',
			width: '100%',
			height: 4,
			backgroundColor: colorMatcher(attendance.scheduled, 1, scheduleMask),
			left: 0,
			bottom: 0
		}
	},

	studentContainer: {
		paddingTop: 80,
		minHeight: '100%'
	},
	student: {
		...calendarRow,
		height: 100,
		background: foreground.white,
		'&> *:first-child': {
			position: 'relative',
			'&:before': {
				position: 'absolute',
				display: 'block',
				content: "''",
				left: '100%',
				bottom: 0,
				height: '100%',
				width: 1,
				backgroundColor: fonts.darkGray,
				transform: 'translateX(-50%)',
				opacity: 0.5
			}
		},
		'&:nth-of-type(2n + 1) > *:first-child': {
			background: `${foreground.lightGreenGray}`,
			zIndex: 1
		}
	}
});

function StudentRow({ classes, student, classroom, name, absenceStatus, startDate }) {
	function onChange(resolved, offset) {}
	console.log(absenceStatus, classroom, student);
	return (
		<div className={classes.student}>
			<ListItem alignItems="center">
				<Hidden mdDown>
					<ListItemAvatar>
						<Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
					</ListItemAvatar>
				</Hidden>
				<ListItemText primary={name} />
			</ListItem>
			{absenceStatus.map((abs, offset) => {
				const targetDate = new Date(startDate);
				targetDate.setDate(targetDate.getDate() + offset);
				return (
					<AbsenceDate
						key={offset}
						classroom={classroom}
						student={student}
						initStat={abs}
						name={name}
						targetDate={targetDate}
						onChange={onChange.bind(offset)}
					/>
				);
			})}
		</div>
	);
}

function Calendar({ classes, absences = [], classroom, classrooms, startDate, endDate, monInit = false, initDays }) {
	const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	const today = new Date();
	const StudentRowComp = withStyles(styles)(StudentRow);
	return (
		<ThemeProvider theme={theme}>
			<Paper elevation={2} square={true} className={classes.weekDaysHeader}>
				<Grid container className={classes.weekDay} />
				{weekdays.map((wd, offset) => {
					let date = new Date(startDate);
					date.setDate(startDate.getDate() + offset);
					return (
						<Grid
							className={`${classes.weekDay} ${initDays[offset] === 1 && classes.scheduled} ${format(
								today,
								'yyyy-MM-dd'
							) === format(date, 'yyyy-MM-dd') && classes.today}`}
							key={wd}
							container
							direction={'column'}
							justify={'center'}
							alignItems={'center'}
						>
							<Typography variant="button">{wd}</Typography>
							<Typography variant="h5">{date.getDate()}</Typography>
						</Grid>
					);
				})}
			</Paper>
			<div className={classes.studentContainer}>
				{classrooms.length == 0 ? (
					<Grid container justify="center" alignItems={'center'} className={classes.studentContainer}>
						<Typography variant="h3">No class to be displayed</Typography>
						<Button variant="contained" size="small" color="primary" component={Link} to={'/openclass'}>
							<AddIcon className={classes.addIcon} />
							Open Class
						</Button>
					</Grid>
				) : classroom > 0 ? (
					absences.map(({ id, name, absenceStatus }) => (
						<StudentRowComp
							key={id}
							classroom={classroom}
							student={id}
							name={name}
							absenceStatus={absenceStatus}
							startDate={startDate}
						/>
					))
				) : (
					<Grid container justify="center" alignItems={'center'} className={classes.studentContainer}>
						<Typography variant="h3">Make sure that you select any class XD</Typography>
					</Grid>
				)}
			</div>
		</ThemeProvider>
	);
}
export default withStyles(styles)(Calendar);
