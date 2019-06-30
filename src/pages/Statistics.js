import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, withRouter } from 'react-router-dom';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { foreground, fonts } from '../const/colors';
import Chart from 'react-google-charts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { Typography } from '../../node_modules/@material-ui/core';

const defaultTheme = createMuiTheme();

const responsivePaperContainer = {
	padding: defaultTheme.spacing(3),
	marginBottom: defaultTheme.spacing(4),
	[defaultTheme.breakpoints.down('sm')]: {
		padding: defaultTheme.spacing(2)
	}
};

const styles = theme => ({
	wrapper: {
		minHeight: '100%',
		background: foreground.lightGreenGray
	},
	progress: {
		marginLeft: 'auto',
		marginRight: 'auto'
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
		...responsivePaperContainer,
		display: 'flex',
		alignItems: 'center',
		position: 'sticky',
		...renameKeys(defaultTheme.mixins.toolbar, { transformer: val => val + 5 }),
		zIndex: 100
	},
	chartContainer: {
		...responsivePaperContainer
	},
	chartDetail: {
		width: '100%',
		overflowX: 'auto'
	},
	formControl: {
		minWidth: 120,
		marginRight: defaultTheme.spacing(4),
		[defaultTheme.breakpoints.down('sm')]: {
			marginRight: defaultTheme.spacing(2)
		}
	},
	chartWrapper: {
		width: '100%',
		paddingTop: '56.25%',
		position: 'relative'
	},
	chartInner: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		left: 0,
		top: 0
	},

	formButton: {
		marginLeft: 'auto',
		marginRight: 0,
		display: 'flex',
		[defaultTheme.breakpoints.down('sm')]: {
			flexDirection: 'column-reverse'
		}
	},
	pagination: {
		display: 'flex',
		alignItems: 'center',
		marginRight: defaultTheme.spacing(2),
		[defaultTheme.breakpoints.down('sm')]: {
			marginTop: defaultTheme.spacing(1),
			marginRight: 0
		}
	}
});

function createData(name, calories, fat, carbs, protein) {
	return { name, calories, fat, carbs, protein };
}

const rows = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9)
];

function Statistics({ classes, location }) {
	let params = new URLSearchParams(location.search);
	const cat = params.get('c');
	const rng = params.get('r');
	const pg = params.get('p');

	const categories = [
		{ label: 'Admission Number', value: 0 },
		{ label: 'Class', value: 1 },
		{ label: 'Building', value: 2 }
	];

	const ranges = [
		{ label: 'Last Week', value: 0 },
		{ label: 'Last Month', value: 1 },
		{ label: 'Last 6 Months', value: 2 }
	];

	const [category, setCategory] = useState(cat === null ? 0 : cat);
	const [range, setRange] = useState(rng === null ? 0 : rng);
	const [page, setPage] = useState(pg === null ? 0 : pg);
	const [data, setData] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(
		() => {
			setLoading(true);
			setData([]);
			setTimeout(() => {
				setData(Array(page + 1).fill(0));
				setLoading(false);
			}, 1000);
		},
		[page]
	);

	function handlePage(offset) {
		if (page + offset <= 0 || data.length === 0 || loading) {
			return;
		}
		setPage(page + offset);
	}
	return (
		<div className={classes.wrapper}>
			<div className={classes.main}>
				<Paper className={classes.toolbar} elevation={2} square>
					<Grid container alignContent="center">
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="categories">Categories</InputLabel>
							<Select
								value={category}
								onChange={e => setCategory(e.target.value)}
								inputProps={{
									name: 'categories',
									id: 'categories'
								}}
							>
								{categories.map(category => (
									<MenuItem key={category.value} value={category.value}>
										{category.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl className={classes.formControl}>
							<InputLabel htmlFor="range">Range</InputLabel>
							<Select
								value={range}
								onChange={e => setRange(e.target.value)}
								inputProps={{
									name: 'range',
									id: 'range'
								}}
							>
								{ranges.map(range => (
									<MenuItem key={range.value} value={range.value}>
										{range.label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<Box className={classes.formButton}>
							<Box className={classes.pagination}>
								<Tooltip title="Prev page" aria-label="prev">
									<IconButton aria-label="Prev Week" size="small" onClick={e => handlePage(-1)}>
										<ChevronLeftIcon />
									</IconButton>
								</Tooltip>
								<Typography>{page + 1}</Typography>
								<Tooltip title="Next page" aria-label="next">
									<IconButton aria-label="Prev Week" size="small" onClick={e => handlePage(+1)}>
										<ChevronRightIcon />
									</IconButton>
								</Tooltip>
							</Box>
							<Button variant="contained" color="primary">
								Find
							</Button>
						</Box>
					</Grid>
				</Paper>
				{loading ? (
					<CircularProgress />
				) : (
					data.map(_ => (
						<Paper className={classes.chartContainer}>
							<Container className={classes.chartWrapper}>
								<Container className={classes.chartInner}>
									<Chart
										width={'100%'}
										height={'100%'}
										chartType="ColumnChart"
										loader={<CircularProgress className={classes.progress} />}
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
								</Container>
							</Container>
							<Container className={classes.chartDetail}>
								<Table className={classes.table}>
									<TableHead>
										<TableRow>
											<TableCell>Dessert (100g serving)</TableCell>
											<TableCell align="right">Calories</TableCell>
											<TableCell align="right">Fat&nbsp;(g)</TableCell>
											<TableCell align="right">Carbs&nbsp;(g)</TableCell>
											<TableCell align="right">Protein&nbsp;(g)</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{rows.map(row => (
											<TableRow key={row.name}>
												<TableCell component="th" scope="row">
													{row.name}
												</TableCell>
												<TableCell align="right">{row.calories}</TableCell>
												<TableCell align="right">{row.fat}</TableCell>
												<TableCell align="right">{row.carbs}</TableCell>
												<TableCell align="right">{row.protein}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Container>
						</Paper>
					))
				)}
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
			return { [key]: renameKeys(value, { newKey, transformer }) };
		}
	});
	return Object.assign({}, ...keyValues);
}

export default withRouter(withStyles(styles)(Statistics));
