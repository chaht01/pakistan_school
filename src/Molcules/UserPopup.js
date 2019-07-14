import React from 'react';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = theme => ({
	root: {}
});

function UserPopup({ classes, user = null }) {
	return <Paper>{user === null ? <CircularProgress /> : `dd`}</Paper>;
}

export default withStyles(styles)(UserPopup);
