import React from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { AuthConsumer } from '../Context/AuthContext';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Sidebar from '../Organism/Sidebar';
import DateController from './DateController';
import { authority } from '../const/auth';

const styles = {
	grow: {
		flexGrow: 1
	}
};

function ButtonAppBar(props) {
	const { classes, routes } = props;
	return (
		<AppBar color="secondary" elevation={0}>
			<Toolbar>
				<Sidebar routes={routes} />
				<Typography variant="h6" color="inherit" className={classes.grow}>
					{routes.map((route, index) => (
						<Route path={route.path} exact={route.exact} component={route.sidebar} />
					))}
				</Typography>
				<DateController />
				<AuthConsumer>
					{({ authState }) =>
						authState === authority.UNAUTH && (
							<Button color="inherit" component={Link} to={'/login'}>
								Login
							</Button>
						)}
				</AuthConsumer>
			</Toolbar>
		</AppBar>
	);
}

ButtonAppBar.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ButtonAppBar);
