import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { foreground } from '../const/colors';

const styles = theme => ({
	root: {
		padding: theme.spacing(4),
		background: foreground.lightGreenGray
	}
});
function UserClassrooms({ classes, classrooms }) {
	return <main className={classes.root}>{classrooms.map(classroom => <div>{classroom.name}</div>)}</main>;
}

export default withStyles(styles)(UserClassrooms);
