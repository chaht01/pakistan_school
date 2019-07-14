import React, { Fragment } from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { foreground } from '../const/colors';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import Divider from '@material-ui/core/Divider';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import ClassCalendar from '../Molcules/ClassCalendar';

const defaultTheme = createMuiTheme();
const styles = theme => ({
	root: {
		paddingTop: defaultTheme.spacing(2),
		paddingBottom: defaultTheme.spacing(2),
		background: foreground.lightGreenGray
	},
	card: {
		display: 'inline-block',
		margin: defaultTheme.spacing(4)
	},
	cardContent: {
		display: 'inline-block'
	}
});
function UserClassrooms({ classes, classrooms, student, ...rest }) {
	return (
		<Grid container className={classes.root} {...rest}>
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
