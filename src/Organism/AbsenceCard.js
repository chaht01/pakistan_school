import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ScheduleBullet from '../Molcules/ScheduleBullet';
import AbsentStudent from '../Organism/AbsentStudent';
import styled from 'styled-components';
import { foreground } from '../const/colors';

const styles = {
	card: {
		minWidth: 275,
		backgroundColor: foreground.lightGreenGray,
		display: 'flex',
		flexDirection: 'column',
		margin: '30px 0'
	},
	title: {
		fontSize: 14
	},
	pos: {
		marginBottom: 12
	}
};

const ScrollableCardContent = styled(CardContent)`
	flex: 1;
	overflow: auto;
`;

function SimpleCard({ classes, title, lecturer, schedule, absences }) {
	const { initDays, startTime, endTime } = schedule;
	return (
		<Card className={classes.card}>
			<CardContent>
				<Grid container spacing={0}>
					<Grid item xs>
						<Typography variant="h5" component="h2">
							{title}
						</Typography>
						<Typography className={classes.title} color="textSecondary">
							{lecturer}
						</Typography>
					</Grid>
					<Grid item>
						<ScheduleBullet editable={false} initDays={initDays} />
						<Typography variant="button" align={'center'}>
							{`${new Date(startTime).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
							})} ~ ${new Date(endTime).toLocaleTimeString([], {
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
							})}`}
						</Typography>
					</Grid>
				</Grid>
			</CardContent>
			<ScrollableCardContent>
				{absences.map(({ name, absenceStatus }) => <AbsentStudent name={name} absenceStatus={absenceStatus} />)}
			</ScrollableCardContent>
			<CardActions>
				<Button size="small">Learn More</Button>
			</CardActions>
		</Card>
	);
}

SimpleCard.propTypes = {
	classes: PropTypes.object.isRequired,
	title: PropTypes.string.isRequired,
	lecturer: PropTypes.string.isRequired,
	schedule: PropTypes.shape({
		initDays: PropTypes.array,
		startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
		endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number])
	}).isRequired,
	absences: PropTypes.array.isRequired
};

export default withStyles(styles)(SimpleCard);
