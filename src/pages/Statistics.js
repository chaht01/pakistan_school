import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
import { subDays, subMonths, isSameDay, isAfter, format, addDays, differenceInDays } from 'date-fns';

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
		{ label: 'Batch', value: 0, param: 'batch' },
		{ label: 'Classroom', value: 1, param: 'classroom' },
		{ label: 'Building', value: 2, param: 'building' }
	];

	const ranges = [
		{ label: 'Last Week', value: 0 },
		{ label: 'Last Month', value: 1 },
		{ label: 'Last 6 Months', value: 2 }
	];

	const [category, setCategory] = useState(cat === null ? 0 : cat);
	const [range, setRange] = useState(rng === null ? 0 : rng);
	const [page, setPage] = useState(pg === null ? 0 : pg);
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [dateRange, setDateRange] = useState({ start: subDays(new Date(), 6), end: new Date() });

	function computeDateInRange() {
		let start = new Date();
		let end = new Date();
		if (range === 0) {
			start = subDays(end, 6);
		} else if (range === 1) {
			start = subMonths(end, 1);
		} else if (range === 2) {
			start = subMonths(end, 6);
		}
		setDateRange({ start, end });
	}

	useEffect(
		() => {
			computeDateInRange();
		},
		[range]
	);

	useEffect(
		() => {
			const CancelToken = axios.CancelToken;
			const source = CancelToken.source();
			function cleanup() {
				source.cancel('canceled');
			}

			async function fetchStatistics() {
				setLoading(true);
				setData(null);
				const { start, end } = dateRange;
				const { data: { data: statistics } } = await axios({
					method: 'get',
					url: `/api/statistics/absence-trends?start_date=${format(start, 'yyyy-MM-dd')}&end_date=${format(
						end,
						'yyyy-MM-dd'
					)}&classification_type=${categories.find(cat => cat.value === category).param}`,
					cancelToken: source.token
				});

				const processedData = statistics.map(stat => ({
					...stat,
					chartData: [
						['Day', `${stat.key.name}`],
						...(() => {
							let curr = start;
							let ret = [];
							while (!isAfter(curr, end)) {
								ret.push([format(curr, 'MM/dd'), 0]);
								curr = addDays(curr, 1);
							}
							// console.log(ret);
							stat.trends.map(({ percentage, date }) => {
								const diff = differenceInDays(new Date(date), start);
								// console.log(start, date, diff);
								ret[diff][1] = percentage;
							});
							return ret;
						})()
					],
					tableData: stat.worst_students
				}));

				setData(processedData);
				setLoading(false);
			}
			// setTimeout(() => {
			// 	setData(Array(page + 1).fill(0));
			// 	setLoading(false);
			// }, 1000);
			fetchStatistics();
			return cleanup;
		},
		[dateRange, category]
	);

	function handlePage(offset) {
		if (page + offset <= 0 || data === null || loading) {
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
							{/* <Box className={classes.pagination}>
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
							</Box> */}
							{/* <Button variant="contained" color="primary">
								Find
							</Button> */}
						</Box>
					</Grid>
				</Paper>
				{loading ? (
					<CircularProgress />
				) : (
					data.map(({ key, chartData, tableData }) => (
						<Paper className={classes.chartContainer}>
							<Container>
								<Typography variant="h5" gutterBottom>
									{key.name}
								</Typography>
							</Container>
							<Container className={classes.chartWrapper}>
								<Container className={classes.chartInner}>
									<Chart
										width={'100%'}
										height={'100%'}
										chartType="Line"
										loader={<CircularProgress />}
										data={chartData}
										options={{
											chart: {
												title: `Attendance Rate classified by ${categories.find(
													cat => cat.value === category
												).label}`,
												subtitle: `${format(dateRange.start, 'yyyy-MM-dd')}~${format(
													dateRange.end,
													'yyyy-MM-dd'
												)}`
											},
											legend: { position: 'none' }
										}}
										rootProps={{ 'data-testid': '3' }}
									/>
								</Container>
							</Container>
							<Container className={classes.chartDetail}>
								<Table className={classes.table}>
									<TableHead>
										<TableRow>
											<TableCell>Name</TableCell>
											<TableCell align="right">Attendance Rate</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{tableData.map(({ student, student_name, percentage }) => (
											<TableRow key={student}>
												<TableCell component="th" scope="row">
													{student_name}
												</TableCell>
												<TableCell align="right">{`${percentage}%`}</TableCell>
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
