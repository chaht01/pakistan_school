import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { AuthConsumer } from '../Context/AuthContext';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { authority, defaultRoute } from '../const/auth';

const styles = theme => ({
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
			width: 400,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1)
	},
	submit: {
		marginTop: theme.spacing(3)
	}
});

function SignIn(props) {
	const { classes } = props;

	return (
		<AuthConsumer>
			{({ authState, login }) =>
				authState !== authority.UNAUTH ? (
					<Redirect to={defaultRoute[authState]} />
				) : (
					<main className={classes.main}>
						<Paper className={classes.paper}>
							<Avatar className={classes.avatar}>
								<LockOutlinedIcon />
							</Avatar>
							<Typography component="h1" variant="h5">
								Sign in
							</Typography>
							<form
								className={classes.form}
								onSubmit={e => {
									login(e.target.id.value, e.target.password.value);
									e.preventDefault();
								}}
							>
								<FormControl margin="normal" required fullWidth>
									<InputLabel htmlFor="id">ID</InputLabel>
									<Input id="id" name="id" autoComplete="id" autoFocus />
								</FormControl>
								<FormControl margin="normal" required fullWidth>
									<InputLabel htmlFor="password">Password</InputLabel>
									<Input
										name="password"
										type="password"
										id="password"
										autoComplete="current-password"
									/>
								</FormControl>
								<Button
									type="submit"
									fullWidth
									variant="contained"
									color="primary"
									className={classes.submit}
								>
									Sign in
								</Button>
							</form>
						</Paper>
					</main>
				)}
		</AuthConsumer>
	);
}

SignIn.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SignIn);
