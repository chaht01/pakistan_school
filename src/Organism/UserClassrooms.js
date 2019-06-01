import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { foreground } from '../const/colors';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ClassCalendar from '../Molcules/ClassCalendar';

const styles = theme => ({
	root: {
		paddingTop: theme.spacing(2),
		paddingBottom: theme.spacing(2),
		background: foreground.lightGreenGray
	},
	card: {
		display: 'inline-block',
		margin: theme.spacing(4)
	},
	cardContent: {
		display: 'inline-block'
	}
});
function UserClassrooms({ classes, classrooms, student }) {
	return (
		<Grid container justify={'center'} className={classes.root}>
			{classrooms.map(classroom => (
				<Card key={classroom.id} comonent={Grid} className={classes.card}>
					<CardContent className={classes.cardContent}>
						<Typography variant="h5" gutterBottom align="center">
							{classroom.name}
						</Typography>
						<Divider variant="middle" />
						<ClassCalendar classroom={classroom.id} student={student} />
					</CardContent>
				</Card>
			))}
		</Grid>
	);
}

export default withStyles(styles)(UserClassrooms);
