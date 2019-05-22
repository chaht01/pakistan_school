import React, { useState, Fragment } from 'react';
import Button from '@material-ui/core/Button';
import withStyles from '@material-ui/core/styles/withStyles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const styles = theme => ({
	dialog: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		[theme.breakpoints.up(900 + theme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paperWidthLg: 900
});

function FinalCheckDialog({ classes, triggerComponent: Trigger, scheduleComp: ScheduleComp }) {
	const [open, setOpen] = useState(false);

	function handleClickOpen() {
		setOpen(true);
	}

	function handleClose() {
		setOpen(false);
	}

	return (
		<Fragment>
			<Trigger variant="outlined" color="primary" onClick={handleClickOpen} />
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
				className={classes.dialog}
				maxWidth="lg"
			>
				<DialogTitle id="form-dialog-title">Final Check</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Schedule cannot be modifed after creation. Make sure below settings.
					</DialogContentText>
					<ScheduleComp />
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color="default">
						Cancel
					</Button>
					<Button onClick={handleClose} color="primary">
						Confirm
					</Button>
				</DialogActions>
			</Dialog>
		</Fragment>
	);
}

export default withStyles(styles)(FinalCheckDialog);
