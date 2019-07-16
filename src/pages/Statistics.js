import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, withRouter } from 'react-router-dom';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { foreground, fonts } from '../const/colors';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import FormGroup from '@material-ui/core/FormGroup';
import Box from '@material-ui/core/Box';
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
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import { subDays, subMonths, isSameDay, isAfter, format, addDays, differenceInDays } from 'date-fns';
import chroma from 'chroma-js';
import Link from '@material-ui/core/Link';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import UserClassrooms from '../Organism/UserClassrooms';

const defaultTheme = createMuiTheme();

const responsivePaperContainer = {
	paddingTop: defaultTheme.spacing(3),
	paddingBottom: defaultTheme.spacing(3),
	marginBottom: defaultTheme.spacing(4),
	[defaultTheme.breakpoints.down('sm')]: {
		paddingTop: defaultTheme.spacing(2),
		paddingBottom: defaultTheme.spacing(2)
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
		padding: defaultTheme.spacing(3),

		[defaultTheme.breakpoints.down('sm')]: {
			padding: defaultTheme.spacing(2)
		},
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
	collapseCell: {
		borderBottom: '1px dashed #dddddd'
	},
	collapseTBody: {
		borderBottom: '1px solid #dddddd'
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
		top: 0,
		fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`
	},
	dialogAvatar: {
		display: 'inline-flex',
		verticalAlign: 'middle'
	},
	dialogContent: {
		padding: 0
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
	const [dialogOpen, setDialogOpen] = useState(false);
	const [dialogStudent, setDialogStudent] = useState(null);
	const [collapse, setCollapse] = useState(false);
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();

	function handleCollapse(e) {
		setCollapse(e.target.checked);
	}

	function handleDialogOpen(student) {
		async function fetchStudent(student) {
			const { data: studentFetched } = await axios({
				method: 'get',
				url: `/api/users/${student}/`,
				cancelToken: source.token
			});
			setDialogStudent(studentFetched);
		}
		setDialogStudent(null);
		fetchStudent(student);
		setDialogOpen(true);
	}

	function handleDialogClose() {
		setDialogStudent(null);
		setDialogOpen(false);
		source.cancel('canceled');
	}

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
						...(() => {
							let curr = start;
							let ret = [];
							while (!isAfter(curr, end)) {
								ret.push([format(curr, 'MM/dd'), 0]);
								curr = addDays(curr, 1);
							}
							stat.trends.map(({ percentage, date }) => {
								const diff = differenceInDays(new Date(date), start);
								ret[diff][1] = percentage;
							});
							return ret.map(elem => ({ name: elem[0], [stat.key.name]: elem[1] }));
						})()
					],
					tableData: stat.worst_students
				}));

				setData(processedData);
				setLoading(false);
			}
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
	const scoreScale = chroma.scale([foreground.red, foreground.emerald]).mode('lch');
	const legendScale = chroma.scale([foreground.cobalt, foreground.purple, foreground.yellow]).mode('lch');
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
							<FormGroup
								aria-label="position"
								name="position"
								value={collapse}
								onChange={handleCollapse}
								row
							>
								<FormControlLabel
									value={collapse}
									control={<Switch color="primary" />}
									label="Collapse"
									labelPlacement="top"
								/>
							</FormGroup>
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
				) : data.length === 0 ? (
					<Typography variant="h4" align="center">
						No result to be shown
					</Typography>
				) : collapse ? (
					<Paper className={classes.chartContainer}>
						<Container>
							<Typography variant="h5" gutterBottom>
								{`Attendance Rate classified by ${categories.find(cat => cat.value === category)
									.label} (collapsed)`}
							</Typography>
							<Typography variant="subtitle2" gutterBottom>{`${format(
								dateRange.start,
								'yyyy-MM-dd'
							)}~${format(dateRange.end, 'yyyy-MM-dd')}`}</Typography>
						</Container>
						<Container className={classes.chartWrapper}>
							<Container className={classes.chartInner}>
								<ResponsiveContainer>
									<LineChart
										data={data.reduce(
											(acc, { key, chartData, tableData }) =>
												chartData.map((row, idx) => ({ ...acc[idx], ...row })),
											[]
										)}
									>
										<CartesianGrid strokeDasharray="3 3" />
										<XAxis dataKey="name" />
										<YAxis />
										<Tooltip />
										<Legend />
										{data.map(({ key, chartData, tableData }, idx, origin) => (
											<Line
												key={key.name}
												type="monotone"
												dataKey={key.name}
												stroke={legendScale.colors(origin.length + 1)[idx]}
											/>
										))}
									</LineChart>
								</ResponsiveContainer>
							</Container>
						</Container>
						<Container className={classes.chartDetail}>
							<Table className={classes.table}>
								<TableHead>
									<TableRow>
										<TableCell>{categories.find(cat => cat.value === category).label}</TableCell>
										<TableCell>Name</TableCell>
										<TableCell align="right">Attendance Rate</TableCell>
									</TableRow>
								</TableHead>
								{data.map(({ key, chartData, tableData }, idx, origin) => (
									<TableBody className={classes.collapseTBody}>
										{tableData.map(({ student, student_name, student_picture, percentage }) => (
											<TableRow key={student}>
												<TableCell className={classes.collapseCell}>{key.name}</TableCell>
												<TableCell className={classes.collapseCell} component="th" scope="row">
													<Avatar
														className={classes.dialogAvatar}
														alt={student_name}
														src={student_picture}
													>
														{student_name[0]}
													</Avatar>{' '}
													<Link onClick={() => handleDialogOpen(student)}>
														{student_name}
													</Link>
												</TableCell>
												<TableCell
													className={classes.collapseCell}
													align="right"
													style={{
														color: scoreScale.colors(11)[
															Math.floor(Number(percentage) / 10)
														]
													}}
												>{`${percentage}%`}</TableCell>
											</TableRow>
										))}
									</TableBody>
								))}
							</Table>
						</Container>
					</Paper>
				) : (
					data.map(({ key, chartData, tableData }) => (
						<Paper className={classes.chartContainer}>
							<Container>
								<Typography variant="h5" gutterBottom>
									{`Attendance Rate classified by ${categories.find(cat => cat.value === category)
										.label} (${key.name})`}
								</Typography>
								<Typography variant="subtitle2" gutterBottom>{`${format(
									dateRange.start,
									'yyyy-MM-dd'
								)}~${format(dateRange.end, 'yyyy-MM-dd')}`}</Typography>
							</Container>
							<Container className={classes.chartWrapper}>
								<Container className={classes.chartInner}>
									<ResponsiveContainer>
										<LineChart data={chartData}>
											<CartesianGrid strokeDasharray="3 3" />
											<XAxis dataKey="name" />
											<YAxis />
											<Tooltip />
											<Legend />
											<Line type="monotone" dataKey={key.name} stroke={foreground.cobalt} />
										</LineChart>
									</ResponsiveContainer>
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
										{tableData.map(({ student, student_name, student_picture, percentage }) => (
											<TableRow key={student}>
												<TableCell component="th" scope="row">
													<Avatar
														className={classes.dialogAvatar}
														alt={student_name}
														src={student_picture}
													>
														{student_name[0]}
													</Avatar>{' '}
													<Link href="javascript:;" onClick={() => handleDialogOpen(student)}>
														{student_name}
													</Link>
												</TableCell>
												<TableCell
													align="right"
													style={{
														color: scoreScale.colors(11)[
															Math.floor(Number(percentage) / 10)
														]
													}}
												>{`${percentage}%`}</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</Container>
						</Paper>
					))
				)}
			</div>

			<Dialog
				open={dialogOpen}
				onClose={handleDialogClose}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
				maxWidth="lg"
			>
				<DialogTitle id="alert-dialog-title">
					{dialogStudent && (
						<Fragment>
							<Avatar
								className={classes.dialogAvatar}
								alt={dialogStudent.profile.name}
								src={dialogStudent.profile.picture}
							>
								{dialogStudent.profile.name[0]}
							</Avatar>{' '}
							{dialogStudent.profile.name}'s
						</Fragment>
					)}{' '}
					Classrooms
				</DialogTitle>
				<DialogContent className={classes.dialogContent}>
					{dialogStudent === null ? (
						<CircularProgress />
					) : (
						<UserClassrooms
							classrooms={dialogStudent.classrooms}
							student={dialogStudent.id}
							style={{ justifyContent: 'center' }}
						/>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDialogClose} color="primary">
						Close
					</Button>
				</DialogActions>
			</Dialog>
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
