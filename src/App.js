import React, { Fragment, useState } from 'react';
import { AuthConsumer } from './Context/AuthContext';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import Dashboard from './pages/Dashboard';
import Sign from './pages/Sign';
import DateController from './Organism/DateController';
import ClassMoreController from './Organism/ClassMoreController';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SchoolIcon from '@material-ui/icons/School';
import GroupIcon from '@material-ui/icons/Group';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import ContactsICon from '@material-ui/icons/Contacts';
import GlobalStyle from './global.css';
import ClassRoom from './pages/ClassRoom';
import Users from './pages/Users';
import { attendance, AttStat } from './const/attendance';
import AppBar from './Organism/AppBar';
import { authority, defaultRoute } from './const/auth';
import OpenClass from './pages/OpenClass';
import ManageClass from './pages/ManageClass';
import Statistics from './pages/Statistics';
import { DateConsumer } from './Context/DateContext';
import { createMuiTheme } from '@material-ui/core/styles';

const defaultTheme = createMuiTheme();
function renameKeys(obj) {
	if (typeof obj !== 'object') return obj;
	const keyValues = Object.entries(obj).map(([key, value]) => {
		if (key === 'minHeight') {
			return { height: `calc(100% - ${value}px)` };
		} else {
			return { [key]: renameKeys(value) };
		}
	});
	return Object.assign({}, ...keyValues);
}

const styles = theme => {
	return {
		appBarSpacer: defaultTheme.mixins.toolbar,
		container: {
			display: 'flex',
			flexDirection: 'column',
			height: '100%'
		},
		appBarContent: renameKeys(defaultTheme.mixins.toolbar)
	};
};

function App({ classes }) {
	const { attended, none, absence, scheduled, late, makeup } = attendance;
	const routes = [
		{
			path: '/',
			to: '/',
			private: true,
			exact: true,
			auth: [authority.AUTH],
			icon: <DashboardIcon />,
			sidebar: () => <Fragment>Dashboard</Fragment>,
			sidebarButton: <DateController />,
			main: () => <DateConsumer>{({ range }) => <Dashboard range={range} />}</DateConsumer>,
			sidebarIndex: 0
		},
		{
			path: ['/classroom/:classId', '/classroom'],
			to: '/classroom',
			private: true,
			exact: false,
			auth: [authority.SUPERADMIN, authority.ADMIN, authority.INSTRUCTOR],
			icon: <SchoolIcon />,
			sidebar: () => <Fragment>Classroom</Fragment>,
			sidebarButton: (
				<Fragment>
					<DateController />
					<ClassMoreController />
				</Fragment>
			),
			main: () => <DateConsumer>{({ range }) => <ClassRoom range={range} />}</DateConsumer>,
			sidebarIndex: 0
		},
		{
			path: ['/users/:query/:action', '/users/:query', '/users'],
			to: '/users',
			private: true,
			exact: false,
			auth: [authority.SUPERADMIN, authority.ADMIN, authority.INSTRUCTOR],
			icon: <ContactsICon />,
			sidebar: () => <Fragment>Users</Fragment>,
			main: () => <Users />,
			sidebarIndex: 0
		},
		{
			path: '/statistics/',
			to: '/statistics',
			private: true,
			exact: false,
			auth: [authority.ADMIN],
			icon: <ShowChartIcon />,
			sidebar: () => <Fragment>Statistics</Fragment>,
			main: () => <Statistics />,
			sidebarIndex: 0
		},
		{
			path: '/logout',
			to: '/logout',
			private: true,
			exact: true,
			auth: [authority.AUTH],
			icon: <GroupIcon />,
			sidebar: () => <Fragment>Logout</Fragment>,
			main: () => <AuthConsumer>{({ logout }) => logout()}</AuthConsumer>,
			sidebarIndex: 1
		},
		{
			path: '/openclass',
			to: '/openclass',
			private: true,
			exact: true,
			auth: [authority.SUPERADMIN, authority.ADMIN, authority.INSTRUCTOR],
			icon: null,
			sidebar: () => <Fragment>Open Class</Fragment>,
			main: () => <OpenClass />,
			sidebarIndex: -1
		},
		{
			path: '/manageclass/:classId',
			to: '/manageclass',
			private: true,
			exact: true,
			auth: [authority.SUPERADMIN, authority.ADMIN, authority.INSTRUCTOR],
			icon: null,
			sidebar: () => <Fragment>Manage Class</Fragment>,
			main: () => <ManageClass />,
			sidebarIndex: -1
		},
		{
			path: '/login',
			to: '/login',
			private: false,
			exact: true,
			auth: [authority.UNAUTH, authority.AUTH],
			icon: <GroupIcon />,
			sidebar: () => <Fragment>Login</Fragment>,
			main: () => <Sign />,
			sidebarIndex: -1
		}
	];

	return (
		<div className={classes.container}>
			<GlobalStyle />
			<Router>
				<AppBar routes={routes} />
				<div className={classes.appBarSpacer} />
				<div className={classes.appBarContent}>
					{routes.map(
						(route, index) =>
							route.private ? (
								<PrivateRoute
									key={index}
									auth={route.auth}
									path={route.path}
									exact={route.exact}
									component={route.main}
								/>
							) : (
								<Route key={index} path={route.path} component={route.main} />
							)
					)}
				</div>
			</Router>
		</div>
	);
}

function PrivateRoute({ auth: authGroup, component: Component, ...rest }) {
	return (
		<AuthConsumer>
			{({ authState, validateAuth }) => (
				<Route
					{...rest}
					render={props =>
						validateAuth(authGroup) ? (
							<Component {...props} />
						) : (
							<Redirect to={{ pathname: defaultRoute[authState], state: { from: props.location } }} />
						)}
				/>
			)}
		</AuthConsumer>
	);
}

export default withStyles(styles)(App);
