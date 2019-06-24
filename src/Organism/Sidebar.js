import React, { Fragment, useState } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { withStyles } from '@material-ui/styles';
import { AuthConsumer } from '../Context/AuthContext';
import Drawer from '@material-ui/core/Drawer';
import MenuIcon from '@material-ui/icons/Menu';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import SettingsIcon from '@material-ui/icons/Settings';
import { getAsyncRole } from '../const/auth';

const styles = {
	list: {
		width: 250
	},
	fullList: {
		width: 'auto'
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	}
};

function Sidebar({ routes, classes }) {
	// const classes = useStyles();
	const [open, setOpen] = useState(false);
	const toggleOpen = state => () => {
		setOpen(state);
	};

	const indexRoutes = routes.reduce(
		(acc, curr) => {
			if (curr.sidebarIndex < 0) {
				return acc;
			}
			if (acc[curr.sidebarIndex] === undefined) {
				while (acc.length <= curr.sidebarIndex) {
					acc.push([]);
				}
			}
			acc[curr.sidebarIndex].push(curr);
			return acc;
		},
		[[]]
	);

	const sideList = (
		<AuthConsumer>
			{({ validateAuth, savedUser, savedRole }) => (
				<div className={classes.list}>
					{savedUser && (
						<Fragment>
							<List>
								<ListItem>
									<ListItemAvatar>
										<Avatar src={savedUser.profile.picture}>{savedUser.profile.name[0]}</Avatar>
									</ListItemAvatar>
									<ListItemText
										primary={savedUser.profile.name}
										secondary={getAsyncRole[savedRole]}
									/>
									<ListItemSecondaryAction>
										<IconButton
											edge="end"
											aria-label="Delete"
											component={Link}
											to={`/users/${savedUser.username}/edit`}
										>
											<SettingsIcon />
										</IconButton>
									</ListItemSecondaryAction>
								</ListItem>
							</List>
							<Divider />
						</Fragment>
					)}

					{indexRoutes.map((routes, i_index, originArr) => (
						<Fragment key={i_index}>
							<List>
								{routes.filter(route => validateAuth(route.auth)).map((route, index) => (
									<ListItem button key={index} component={Link} to={route.to}>
										<ListItemIcon>{route.icon}</ListItemIcon>
										<ListItemText primary={route.sidebar()} />
									</ListItem>
								))}
							</List>
							{originArr.length - 1 !== i_index && <Divider />}
						</Fragment>
					))}
				</div>
			)}
		</AuthConsumer>
	);
	return (
		<Fragment>
			<IconButton className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleOpen(true)}>
				<MenuIcon />
			</IconButton>
			<Drawer open={open} onClose={toggleOpen(false)}>
				<div tabIndex={0} role="button" onClick={toggleOpen(false)} onKeyDown={toggleOpen(false)}>
					{sideList}
				</div>
			</Drawer>
		</Fragment>
	);
}
export default withStyles(styles)(Sidebar);
