import React from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { foreground, fonts } from '../const/colors';
import Chart from 'react-google-charts';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const defaultTheme = createMuiTheme();
const styles = theme => ({
	wrapper: {
		minHeight: '100%',
		background: foreground.lightGreenGray
	},
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: defaultTheme.spacing(3),
		marginRight: defaultTheme.spacing(3),
		paddingTop: defaultTheme.spacing(4),
		paddingBottom: defaultTheme.spacing(6),
		[defaultTheme.breakpoints.up(900 + defaultTheme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto',
			paddingTop: defaultTheme.spacing(6)
		}
	},
	toolbar: {
		padding: defaultTheme.spacing(3),
		marginBottom: defaultTheme.spacing(4),
		position: 'sticky',
		...renameKeys(defaultTheme.mixins.toolbar, { transformer: val => val + 10 }),
		zIndex: 100
	},
	chartContainer: {
		height: 360,
		padding: defaultTheme.spacing(3)
	},
	formControl: {
		minWidth: 120
	}
});

function Statistics({ classes }) {
	const [values, setValues] = React.useState({
		age: '',
		name: 'hai'
	});

	function handleChange(event) {
		setValues(oldValues => ({
			...oldValues,
			[event.target.name]: event.target.value
		}));
	}

	return (
		<div className={classes.wrapper}>
			<div className={classes.main}>
				<Paper className={classes.toolbar} elevation={2} square>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="age-simple">Categories</InputLabel>
						<Select
							value={values.age}
							onChange={handleChange}
							inputProps={{
								name: 'age',
								id: 'age-simple'
							}}
						>
							<MenuItem value={10}>Admission Number</MenuItem>
							<MenuItem value={20}>Class</MenuItem>
							<MenuItem value={30}>Building</MenuItem>
						</Select>
					</FormControl>

					<ButtonGroup variant="contained" size="small" aria-label="Small contained button group">
						<Button>One</Button>
						<Button>Two</Button>
						<Button>Three</Button>
					</ButtonGroup>
				</Paper>
				<Paper className={classes.chartContainer}>
					<Chart
						width={'100%'}
						height={'100%'}
						chartType="ColumnChart"
						loader={<div>Loading Chart</div>}
						data={[
							['City', '2010 Population', '2000 Population'],
							['New York City, NY', 8175000, 8008000],
							['Los Angeles, CA', 3792000, 3694000],
							['Chicago, IL', 2695000, 2896000],
							['Houston, TX', 2099000, 1953000],
							['Philadelphia, PA', 1526000, 1517000]
						]}
						options={{
							title: 'Population of Largest U.S. Cities',
							chartArea: { width: '30%' },
							hAxis: {
								title: 'Total Population',
								minValue: 0
							},
							vAxis: {
								title: 'City'
							}
						}}
						legendToggle
					/>
				</Paper>
			</div>
		</div>
	);
}

function renameKeys(obj, { newKey = 'top', transformer = val => val } = { newKey: 'top', transformer: val => val }) {
	if (typeof obj !== 'object') return obj;
	const keyValues = Object.entries(obj).map(([key, value]) => {
		if (key === 'minHeight') {
			return { [newKey]: transformer(value) };
		} else {
			return { [key]: renameKeys(value) };
		}
	});
	return Object.assign({}, ...keyValues);
}

export default withStyles(styles)(Statistics);
