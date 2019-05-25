import React, { useState, useEffect } from 'react';
import { withStyles } from '@material-ui/core';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';
import { foreground } from '../const/colors';
import Backbone from '../Molcules/Backbone';
import AbsenceCounter from '../Organism/AbsenceCounter';
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import axios from 'axios';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subMonths } from 'date-fns';

const defaultTheme = createMuiTheme();
let theme = createMuiTheme({
	overrides: {
		MuiInputBase: {
			root: {
				...responsiveFontSizes(defaultTheme).typography.h4
			}
		},
		MuiContainer: {
			root: {
				[defaultTheme.breakpoints.down('sm')]: {
					width: 70,
					paddingLeft: 0,
					paddingRight: 0
				},
				[defaultTheme.breakpoints.up('md')]: {
					width: 160,
					paddingLeft: 0,
					paddingRight: 0
				},
				[defaultTheme.breakpoints.up('lg')]: {
					width: 200,
					paddingLeft: 0,
					paddingRight: 0
				},
				marginLeft: 'initial',
				marginRight: 'initial'
			}
		}
	}
});
theme = responsiveFontSizes(theme);

const styles = theme => ({
	statBar: {
		[theme.breakpoints.down('sm')]: {
			height: 90,
			padding: '0 24px'
		},
		[theme.breakpoints.up('md')]: {
			height: 120,
			padding: '0 36px'
		},
		[theme.breakpoints.up('lg')]: {
			height: 150,
			padding: '0 48px'
		},
		background: `${foreground.lightGreenGray}`
	},
	statLabel: {
		marginRight: theme.spacing(2)
	}
});

function Statbar({ classes, width, adornment, building = -1, classroom = -1, children, current }) {
	const [timer, setTimer] = useState(new Date());
	const [todayStat, setTodayStat] = useState(0);
	const [weekStat, setWeekStat] = useState(0);
	const [monthStat, setMonthStat] = useState(0);
	const space = isWidthDown('sm', width) ? 90 : isWidthUp('lg', width) ? 150 : 120;

	function tick() {
		setTimer(new Date());
	}

	useEffect(
		() => {
			var timerID = setInterval(() => tick(), 3000);
			async function getStatistics(start_date, end_date, setStat) {
				if (building > 0 || classroom > 0) {
					try {
						let { data: { total_absence_count: stat } } = await axios({
							method: 'get',
							url:
								classroom > 0
									? `/api/statistics/buildings/${building}/classrooms/${classroom}/absence-statistics/`
									: `/api/statistics/buildings/${building}/absence-statistics/`,
							params: {
								start_date,
								end_date
							}
						});
						setStat(stat);
					} catch (err) {
						setStat('?');
					}
				} else {
					setStat('?');
				}
			}

			getStatistics(format(current, 'yyyy-MM-dd'), format(current, 'yyyy-MM-dd'), setTodayStat);
			getStatistics(
				format(startOfWeek(current), 'yyyy-MM-dd'),
				format(endOfWeek(current), 'yyyy-MM-dd'),
				setWeekStat
			);

			const sow = startOfWeek(current);
			let som, eom;
			if (sow.getMonth() !== current.getMonth()) {
				som = startOfMonth(subMonths(current, 1));
				eom = endOfMonth(subMonths(current, 1));
			} else {
				som = startOfMonth(current);
				eom = endOfMonth(current);
			}

			getStatistics(format(som, 'yyyy-MM-dd'), format(eom, 'yyyy-MM-dd'), setMonthStat);

			return function cleanup() {
				clearInterval(timerID);
			};
		},
		[timer, current, building]
	);

	return (
		<ThemeProvider theme={theme}>
			<Backbone
				header={
					<Grid container justify="space-between" alignItems="center" className={classes.statBar}>
						<Grid item>{adornment}</Grid>
						<Grid item xs>
							<Grid container justify="flex-end">
								<Container>
									<Grid container>
										<Grid item>
											<Typography variant="button" className={classes.statLabel}>
												Today
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="h3">{todayStat}</Typography>
										</Grid>
									</Grid>
								</Container>
								<Container>
									<Grid container>
										<Grid item>
											<Typography variant="button" className={classes.statLabel}>
												Weekly
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="h3">{weekStat}</Typography>
										</Grid>
									</Grid>
								</Container>
								<Container>
									<Grid container>
										<Grid item>
											<Typography variant="button" className={classes.statLabel}>
												Monthly
											</Typography>
										</Grid>
										<Grid item>
											<Typography variant="h3">{monthStat}</Typography>
										</Grid>
									</Grid>
								</Container>
							</Grid>
						</Grid>
					</Grid>
				}
				content={children}
				space={space}
			/>
		</ThemeProvider>
	);
}

export default withWidth()(withStyles(styles)(Statbar));
