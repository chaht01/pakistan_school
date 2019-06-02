import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import AttendBullet from '../Molcules/AttendBullet';
import AbsentStudent from '../Organism/AbsentStudent';
import styled from 'styled-components';
import { foreground } from '../const/colors';
import { attendance, scheduleMask } from '../const/attendance';
import Box from '@material-ui/core/Box';
import { Link } from 'react-router-dom';

const styles = theme => ({
	card: {
		minWidth: 275,
		backgroundColor: foreground.lightGreenGray,
		display: 'flex',
		flexDirection: 'column',
		margin: '30px 0',
		textDecoration: 'none',
		'&:hover': {
			boxShadow: theme.shadows[4]
		}
	},
	title: {
		textTransform: 'capitalize'
	},
	lecturer: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	},
	gridHeader: {
		borderTop: '1px solid #e1e1e7'
	},
	gridItems: {
		'&:nth-child(1)': {
			borderRight: '1px solid #e1e1e7'
		}
	}
});

const ScrollableCardContent = styled(CardContent)`
	flex: 1;
	overflow: auto;
	background: #fff;
`;

function SimpleCard({ classes, id, title, lecturers, schedule, absences }) {
	const { initDays, startTime, endTime } = schedule;
	return (
		<Card className={classes.card} component={Link} to={`/classroom/${id}`}>
			<CardContent>
				<Grid container spacing={3}>
					<Grid item xs={8}>
						<Typography className={classes.title} variant="h5">
							{title}
						</Typography>
						<Typography className={classes.lecturer} color="textSecondary" gutterBottom={true}>
							{lecturers.map(lecturer => <Box>{lecturer.profile.name}</Box>)}
						</Typography>
					</Grid>
					<Grid item xs={4}>
						<Typography variant="button">
							<Box textAlign="right">{`${startTime} ~ ${endTime}`}</Box>
						</Typography>
					</Grid>
				</Grid>
				<Grid container spacing={3} className={classes.gridHeader}>
					<Grid className={classes.gridItems} item xs={6}>
						<AttendBullet
							states={initDays.map(day => (day === 1 ? attendance.scheduled : attendance.none))}
							mask={scheduleMask}
						/>
					</Grid>
					<Grid className={classes.gridItems} item xs={6}>
						<AttendBullet
							states={initDays.map(day => (day === 1 ? attendance.scheduled : attendance.none))}
							mask={scheduleMask}
						/>
					</Grid>
				</Grid>
			</CardContent>
			<ScrollableCardContent>
				{absences
					.reduce(
						(acc, curr) => {
							if (acc[acc.length - 1].length < 2) {
								acc[acc.length - 1].push(curr);
							} else {
								let newarr = [curr];
								acc.push(newarr);
							}
							return acc;
						},
						[[]]
					)
					.map(pairRow => {
						return (
							<Grid container spacing={3}>
								{pairRow.map(({ name, absenceStatus }) => (
									<Grid className={classes.gridItems} item xs={6}>
										<AbsentStudent name={name} absenceStatus={absenceStatus} />
									</Grid>
								))}
							</Grid>
						);
					})}
			</ScrollableCardContent>
		</Card>
	);
}

SimpleCard.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	lecturer: PropTypes.string.isRequired,
	schedule: PropTypes.shape({
		initDays: PropTypes.array,
		startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string]),
		endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
	}).isRequired,
	absences: PropTypes.array.isRequired
};

export default withStyles(styles)(SimpleCard);
