import React, { useState, useEffect } from 'react';
import { createMuiTheme, responsiveFontSizes, withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import FilterListIcon from '@material-ui/icons/FilterList';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import ClearIcon from '@material-ui/icons/Clear';
import axios from 'axios';
import { ThemeProvider } from '@material-ui/styles';
import { foreground, fonts } from '../const/colors';
import UserClassrooms from '../Organism/UserClassrooms';

function renameKeys(obj) {
	if (typeof obj !== 'object') return obj;
	const keyValues = Object.entries(obj).map(([key, value]) => {
		if (key === 'minHeight') {
			return { top: value };
		} else {
			return { [key]: renameKeys(value) };
		}
	});
	return Object.assign({}, ...keyValues);
}

const styles = theme => ({
	root: {
		backgroundColor: foreground.lightGreenGray,
		paddingTop: theme.spacing(8),
		paddingBottom: theme.spacing(8),
		minHeight: '100%'
	},
	sticky: {
		position: 'sticky',
		...renameKeys(theme.mixins.toolbar)
	},
	main: {
		width: 'auto',
		display: 'block', // Fix IE 11 issue.
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(3),
		[theme.breakpoints.up(900 + theme.spacing(3 * 2))]: {
			width: 900,
			marginLeft: 'auto',
			marginRight: 'auto'
		}
	}
});

const defaultTheme = createMuiTheme();
const theme = createMuiTheme({
	overrides: {
		MuiToolbar: {
			root: {
				position: 'sticky',
				...renameKeys(defaultTheme.mixins.toolbar)
			}
		}
	}
});

function Users({ classes }) {
	const [state, setState] = useState({
		columns: [
			{ title: 'Name', field: 'profile.name' },
			{ title: 'Username', field: 'username', editable: 'onAdd' },
			{ title: 'Phone', field: 'profile.phone_number', editable: 'onUpdate' },
			{ title: 'Gender', field: 'profile.gender', lookup: { Man: 'Man', Woman: 'Woman' } }
			// { title: 'Class', field: 'classroom.name', editable: 'never' }
		],
		data: []
	});

	const [error, handleError] = useState({ value: false, message: '' });

	useEffect(() => {
		async function fetchUsers() {
			const { data } = await axios({
				method: 'get',
				url: '/api/users/'
			});
			setState({ ...state, data });
		}
		fetchUsers();
	}, []);

	function raiseError(message) {
		handleError({
			value: true,
			message
		});
	}

	function onCloseError() {
		handleError({
			value: false,
			message: ''
		});
	}

	function handleCatch(reject, { response: { data: messages } }) {
		raiseError(
			Object.entries(messages)
				.map(([key, value]) => `${key}: ${value}`)
				.join('\n')
		);
		reject(messages);
	}
	return (
		<div className={classes.root}>
			<main className={classes.main}>
				<ThemeProvider theme={theme}>
					<MaterialTable
						title="Users"
						columns={state.columns}
						data={state.data}
						icons={{
							Add: AddIcon,
							Delete: DeleteOutlineIcon,
							Edit: EditIcon,
							Check: DoneIcon,
							Filter: FilterListIcon,
							FirstPage: FirstPageIcon,
							LastPage: LastPageIcon,
							PreviousPage: ChevronLeftIcon,
							NextPage: ChevronRightIcon,
							Search: SearchIcon,
							ResetSearch: ClearIcon,
							Clear: ClearIcon,
							DetailPanel: ChevronRightIcon
						}}
						detailPanel={rowData => <UserClassrooms classrooms={rowData.classrooms} />}
						options={{
							actionsColumnIndex: -1
						}}
						onRowClick={(event, rowData, togglePanel) => togglePanel()}
						editable={{
							onRowAdd: newData =>
								new Promise((resolve, reject) => {
									axios({
										method: 'post',
										url: '/api/users/',
										data: {
											username: newData.username,
											profile: {
												name: newData['profile.name'],
												gender: newData['profile.gender']
											}
										}
									})
										.then(({ data: resolved }) => {
											resolve(newData);
											const data = state.data;
											data.push(newData);
											setState({ ...state, data });
										})
										.catch(handleCatch.bind(this, reject));
								}),
							onRowUpdate: (newData, oldData) =>
								new Promise((resolve, reject) => {
									axios({
										method: 'patch',
										url: `/api/users/${newData.id}/`,
										data: {
											profile: {
												name: newData['profile.name'],
												gender: newData['profile.gender'],
												phone_number: newData['profile.phone_number']
											}
										}
									})
										.then(({ data: resolved }) => {
											resolve(newData);
											const data = state.data;

											setState({
												...state,
												data: data.map(item => {
													if (item.id === newData.id) {
														return newData;
													}
													return item;
												})
											});
										})
										.catch(handleCatch.bind(this, reject));
								}),
							onRowDelete: oldData =>
								new Promise((resolve, reject) => {
									axios({
										method: 'delete',
										url: `/api/users/${oldData.id}/`
									})
										.then(({ data: resolved }) => {
											const data = state.data;
											setState({
												...state,
												data: data.filter(item => item.id !== oldData.id)
											});
											resolve();
										})
										.catch(handleCatch.bind(this, reject));
								})
						}}
					/>
				</ThemeProvider>
			</main>
			<Snackbar
				open={error.value}
				onClose={onCloseError}
				TransitionComponent={Slide}
				ContentProps={{
					'aria-describedby': 'message-id'
				}}
				message={<span id="message-id">{error.message}</span>}
				action={[
					<IconButton key="close" aria-label="Close" color="inherit" onClick={onCloseError}>
						<CloseIcon />
					</IconButton>
				]}
			/>
		</div>
	);
}
export default withStyles(styles)(Users);
