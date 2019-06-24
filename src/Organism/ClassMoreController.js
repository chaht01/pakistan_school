import React, { Fragment } from 'react';
import { withRouter } from 'react-router';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
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

const defaultTheme = createMuiTheme();

const styles = theme => ({
	addIcon: {
		marginRight: defaultTheme.spacing(1)
	}
});

const ITEM_HEIGHT = 48;

function ClassMoreController({ classes, match }) {
	const { params: { classId }, path } = match;
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const options = [
		{ label: 'Open Class', icon: <AddIcon />, path: '/openclass', visible: true },
		{ label: 'Manage', icon: <SettingsIcon />, path: `/manageclass/${classId}`, visible: classId > 0 }
	];

	function handleClick(event) {
		setAnchorEl(event.currentTarget);
	}

	function handleClose() {
		setAnchorEl(null);
	}
	return (
		<Fragment>
			<Hidden smDown>
				<Button variant="contained" size="small" color="primary" component={Link} to={options[0].path}>
					<AddIcon className={classes.addIcon} />
					{options[0].label}
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
					{options.map(
						option =>
							option.visible && (
								<MenuItem key={option.label} onClick={handleClose} component={Link} to={option.path}>
									<ListItemIcon>{option.icon}</ListItemIcon>
									<Typography variant="inherit">{option.label}</Typography>
								</MenuItem>
							)
					)}
				</Menu>
			</Hidden>
		</Fragment>
	);
}

export default withRouter(withStyles(styles)(ClassMoreController));
