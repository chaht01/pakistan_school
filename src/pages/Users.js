import React, { useState, useEffect } from 'react';
import { createMuiTheme, responsiveFontSizes, withStyles } from '@material-ui/core/styles';
import MaterialTable from 'material-table';
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
			{ title: 'Username', field: 'username', editable: 'never' },
			{ title: 'Phone', field: 'profile.phone_number' },
			{ title: 'Gender', field: 'profile.gender', lookup: { Man: 'Man', Women: 'Women' } },
			{ title: 'Class', field: 'classroom.name', editable: 'never' }
			// { title: 'Birth Year', field: 'birthYear', type: 'numeric' },
			// {
			// 	title: 'Birth Place',
			// 	field: 'birthCity',
			// 	lookup: { 34: 'İstanbul', 63: 'Şanlıurfa' }
			// }
		],
		data: [
			// { name: 'Mehmet', surname: 'Baran', birthYear: 1987, birthCity: 63 },
			// { name: 'Zerya Betül', surname: 'Baran', birthYear: 2017, birthCity: 34 }
		]
	});
	useEffect(() => {
		async function fetchUsers() {
			const { data } = await axios({
				method: 'get',
				url: '/api/users/'
			});

			const class_flatten = data.reduce((acc, curr) => {
				if (curr.classrooms.length === 0) {
					acc = [...acc, { ...curr, classroom: { id: -1, name: '' } }];
				} else {
					acc = [
						...acc,
						...curr.classrooms.map(classroom => ({
							...curr,
							classroom
						}))
					];
				}

				return acc;
			}, []);
			setState({ ...state, data: class_flatten });
		}
		fetchUsers();
	}, []);
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
							Clear: ClearIcon
						}}
						editable={{
							onRowAdd: newData =>
								new Promise((resolve, reject) => {
									setTimeout(() => {
										const data = state.data;
										data.push(newData);
										setState({ ...state, data });
										resolve();
									}, 1000);
								}),
							onRowUpdate: (newData, oldData) =>
								new Promise((resolve, reject) => {
									setTimeout(() => {
										const data = state.data;
										const index = data.indexOf(oldData);
										data[index] = newData;
										setState({ ...state, data });
										resolve();
									}, 1000);
								}),
							onRowDelete: oldData =>
								new Promise((resolve, reject) => {
									setTimeout(() => {
										let data = state.data;
										const index = data.indexOf(oldData);
										data.splice(index, 1);
										setState({ ...state, data });
										resolve();
									}, 1000);
								})
						}}
					/>
				</ThemeProvider>
			</main>
		</div>
	);
}
export default withStyles(styles)(Users);
