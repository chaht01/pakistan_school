import React, { Fragment } from 'react';
import { withStyles } from '@material-ui/styles';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import SettingsIcon from '@material-ui/icons/Settings';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';

const styles = theme => ({
	addIcon: {
		marginRight: theme.spacing(1)
	}
});

const options = [
	{ label: 'Open Class', icon: <AddIcon />, path: '/openclass' },
	{ label: 'Manage', icon: <SettingsIcon />, path: 'openclass' }
];

const ITEM_HEIGHT = 48;

function ClassMoreController({ classes }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}
	return (
		<Fragment>
			<Hidden mdDown>
				<Button variant="contained" size="small" color="primary">
					<AddIcon className={classes.addIcon} />
					Open Class
				</Button>
			</Hidden>
			<Hidden mdUp>
				<IconButton
					aria-label="More"
					aria-owns={open ? 'long-menu' : undefined}
					aria-haspopup="true"
					onClick={handleClick}
				>
					<MoreVertIcon />
				</IconButton>
				<Menu
					id="long-menu"
					anchorEl={anchorEl}
					open={open}
					onClose={handleClose}
					PaperProps={{
						style: {
							maxHeight: ITEM_HEIGHT * 4.5,
							width: 200
						}
					}}
				>
					{options.map(option => (
						<MenuItem key={option.label} onClick={handleClose} component={Link} to={option.path}>
							<ListItemIcon>{option.icon}</ListItemIcon>
							<Typography variant="inherit">{option.label}</Typography>
						</MenuItem>
					))}
				</Menu>
			</Hidden>
		</Fragment>
	);
}

export default withStyles(styles)(ClassMoreController);
