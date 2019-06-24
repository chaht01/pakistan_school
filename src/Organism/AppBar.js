import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { AuthConsumer } from '../Context/AuthContext';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Sidebar from '../Organism/Sidebar';
import { authority } from '../const/auth';
import Grid from '@material-ui/core/Grid';

const defaultTheme = createMuiTheme();
const styles = theme => ({
	grow: {
		flexGrow: 1
	},
	appBarButtonGroup: {
		width: 'auto',
		'&>*': {
			marginLeft: defaultTheme.spacing(2),

			[defaultTheme.breakpoints.down('sm')]: {
				marginLeft: defaultTheme.spacing(1)
			}
		}
	}
});

function ButtonAppBar(props) {
	const { classes, routes } = props;
	return (
		<AppBar color="secondary" elevation={0}>
			<Toolbar>
				<Sidebar routes={routes} />
				<Typography variant="h6" color="inherit" className={classes.grow}>
					{routes.map((route, index) => (
						<Route key={index} path={route.path} exact={route.exact} component={route.sidebar} />
					))}
				</Typography>
				{routes.map(
					(route, index) =>
						route.sidebarButton && (
							<Route
								key={index}
								path={route.path}
								exact={route.exact}
								component={() => (
									<Grid container alignItems="center" className={classes.appBarButtonGroup}>
										{route.sidebarButton}
									</Grid>
								)}
							/>
						)
				)}
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
