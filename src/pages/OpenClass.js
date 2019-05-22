import React, { useState, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import FormGroup from '@material-ui/core/FormGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import ChipInput from 'material-ui-chip-input';
import ReactAutosuggestRemote from '../Molcules/ReactAutosuggestRemote';
import { MuiPickersUtilsProvider, TimePicker, DatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import ScheduleBullet from '../Molcules/ScheduleBullet';
import FinalCheckDialog from '../Organism/FinalCheckDialog';

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(900 + theme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	sectionHeading: {
		...theme.typography.button,
		fontSize: '1rem'
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(6)}px`
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		width: 225,
		marginTop: theme.spacing(3),
		marginBottom: theme.spacing(3),
		[theme.breakpoints.up(225 + theme.spacing(3 * 2))]: {
			width: 'auto'
		}
	},
	grow: {
		flex: 1
	},
	gutterContainer: {
		width: `calc(100% + ${theme.spacing(4)}px)`,
		marginLeft: -2 * theme.spacing(1)
	},
	gutter: {
		padding: theme.spacing(2)
	},
	marginNormal: {
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(8)
	}
	// scheduleBulletControl: theme.Input.FormControl
});

const Schedule = withStyles(theme => ({
	grow: {
		flex: 1
	},
	gutter: {
		padding: theme.spacing(2)
	}
}))(function({ classes, startDate, handleStartDate, endDate, handleEndDate, ...rest }) {
	return (
		<FormGroup>
			<Grid container spacing={24}>
				<Grid item xs={8} md>
					<FormGroup className={`${classes.grow} ${classes.gutter}`}>
						<FormControl margin="dense" required>
							<DatePicker
								label="Start Date"
								value={startDate}
								onChange={handleStartDate}
								animateYearScrolling
							/>
						</FormControl>
						<FormControl margin="dense" required>
							<DatePicker
								label="End Date"
								value={endDate}
								onChange={handleEndDate}
								animateYearScrolling
							/>
						</FormControl>
					</FormGroup>
				</Grid>
				<Grid item xs={8} md>
					<FormGroup className={`${classes.grow} ${classes.gutter}`}>
						<ScheduleBullet label={'Schedule'} fullWidth={true} />
					</FormGroup>
				</Grid>
				<Grid item xs={8} md>
					<FormGroup className={`${classes.grow} ${classes.gutter}`}>
						<FormControl margin="dense" required>
							<TimePicker
								label="Start Time"
								value={startDate}
								onChange={handleStartDate}
								animateYearScrolling
							/>
						</FormControl>
						<FormControl margin="dense" required>
							<TimePicker
								label="End Time"
								value={endDate}
								onChange={handleEndDate}
								animateYearScrolling
							/>
						</FormControl>
					</FormGroup>
				</Grid>
			</Grid>
		</FormGroup>
	);
});

function OpenClass(props) {
	const { classes } = props;
	const instructorPool = ['abc', 'def', 'ghi', 'jklm'];
	const [chips, setChips] = useState([]);
	const handleAddChip = chip => {
		setChips([...chips, chip]);
	};
	const handleDeleteChip = (chip, index) => {
		setChips([...chips.slice(0, index), ...chips.slice(index + 1)]);
	};
	const [startDate, handleStartDate] = useState(new Date());
	const [endDate, handleEndDate] = useState(new Date());
	return (
		<main className={classes.main}>
			<Paper className={classes.paper}>
				<form
					className={classes.form}
					onSubmit={e => {
						e.preventDefault();
					}}
				>
					<Typography className={classes.sectionHeading}>Class Info</Typography>
					<FormControl className={classes.marginNormal} required fullWidth>
						<InputLabel htmlFor="className">Class Name</InputLabel>
						<Input id="className" name="className" autoFocus />
					</FormControl>

					<Typography className={classes.sectionHeading}>Schedule</Typography>
					<Schedule
						startDate={startDate}
						handleStartDate={handleStartDate}
						endDate={endDate}
						handleEndDate={handleEndDate}
					/>

					<Typography className={classes.sectionHeading}>Members</Typography>
					<FormControl className={classes.marginNormal} required fullWidth>
						<ReactAutosuggestRemote
							label="Instructors"
							fullWidth
							required
							newChipKeyCodes={[13, 188]}
							placeholder="Search a country"
							fullWidth
						/>
					</FormControl>
					<FormControl className={classes.marginNormal} required fullWidth>
						<ChipInput
							label="Instructors"
							fullWidth
							required
							newChipKeyCodes={[13, 188]}
							value={chips}
							dataSource={instructorPool}
							onAdd={chip => handleAddChip(chip)}
							onDelete={(chip, index) => handleDeleteChip(chip, index)}
						/>
					</FormControl>
				</form>
			</Paper>
			<Grid container className={classes.demo} justify="center" spacing={24}>
				<Grid item>
					<Button fullWidth color="default" className={classes.submit}>
						Cancel
					</Button>
				</Grid>
				<Grid item>
					<FinalCheckDialog
						scheduleComp={() => (
							<Fragment>
								<Typography className={classes.sectionHeading}>Schedule</Typography>
								<Schedule
									startDate={startDate}
									handleStartDate={handleStartDate}
									endDate={endDate}
									handleEndDate={handleEndDate}
								/>
							</Fragment>
						)}
						triggerComponent={props => (
							<Button {...props} fullWidth variant="contained" color="primary" className={classes.submit}>
								Confirm
							</Button>
						)}
					/>
				</Grid>
			</Grid>
		</main>
	);
}

export default withStyles(styles)(OpenClass);
