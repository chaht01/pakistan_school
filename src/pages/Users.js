import React, { useState, useEffect, Fragment } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Input from '@material-ui/core/Input';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import MaterialTable, { MTableToolbar, MTablePagination } from 'material-table';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import AddBoxIcon from '@material-ui/icons/AddBox';
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
import { withStyles } from '@material-ui/styles';
import { foreground, fonts } from '../const/colors';
import UserClassrooms from '../Organism/UserClassrooms';
import { authority, getRolePriority, underRole } from '../const/auth';

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
		zIndex: 100,
		background: '#fff',
		borderBottom: `1px solid ${foreground.gray}`,
		...renameKeys(theme.mixins.toolbar)
	},
	footer: {
		position: 'sticky',
		zIndex: 100,
		bottom: 0,
		background: '#fff'
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
	},
	uploadButton: {
		display: 'none',
		zIndex: -9999
	},
	uploadAvatar: {
		width: 30,
		height: 30,
		marginRight: 10
	}
});

function flattenRole(roleArr, key) {
	return {
		[key || 'flatRole']: roleArr.length === 0 ? '' : getRolePriority(roleArr)
	};
}

function Users({ classes }) {
	const roleSelf = getRolePriority(localStorage.getItem('roles').split(','));
	const availableRoles = underRole(roleSelf);
	let role_lookup = availableRoles.reduce(function(acc, cur) {
		acc[cur] = cur;
		return acc;
	}, {});

	const columns = [
		{
			title: 'Profile',
			field: 'profile.picture',
			render: rowData => (
				<Avatar alt={rowData.profile.name} src={rowData.profile.picture}>
					{rowData.profile.name[0]}
				</Avatar>
			),
			editComponent: ({ rowData, value, onChange, columnDef }) => {
				const [img, setImg] = useState(rowData.profile.picture);
				function handleTempUpload(input) {
					// onChange(input.target.value);
					if (input.target.files && input.target.files[0]) {
						onChange(input.target.files[0]);
						var reader = new FileReader();
						reader.onload = function(e) {
							console.log(e.target);
							setImg(e.target.result);
							// onChange(e.target.result);
							// onChange({ img: e.target.result, local: input.target });
						};

						reader.readAsDataURL(input.target.files[0]);
					}
				}
				return (
					<Fragment>
						<input
							accept="image/*"
							id="raised-button-file"
							type="file"
							className={classes.uploadButton}
							// value={value}
							onChange={handleTempUpload.bind(this)}
						/>

						<label htmlFor="raised-button-file">
							<Button
								variant="outlined"
								component="span"
								color="primary"
								className={classes.button}
								size="small"
							>
								<Avatar className={classes.uploadAvatar} alt={rowData.profile.name} src={img}>
									{rowData.profile.name[0]}
								</Avatar>{' '}
								Upload
							</Button>
						</label>
					</Fragment>
				);
			}
		},
		{ title: 'Name *', field: 'profile.name' },
		{ title: 'Username *', field: 'username', editable: 'onAdd' },
		{
			title: 'Role *',
			field: 'role',
			lookup: role_lookup
		},
		{
			title: 'Password',
			field: 'password',
			render: rowData => <span>****</span>
		},
		{ title: 'Phone', field: 'profile.phone_number', editable: 'onUpdate' },
		{ title: 'Gender', field: 'profile.gender', lookup: { Man: 'Man', Woman: 'Woman' } },
		{ title: 'Birthday', field: 'profile.birthday', type: 'date' },
		{ title: 'Age', field: 'profile.age', type: 'numeric' },
		{ title: 'Hobby', field: 'profile.hobby', type: 'string' },
		{ title: 'Address', field: 'profile.address', type: 'string' },
		{ title: 'Religion', field: 'profile.religion', type: 'string' },
		{ title: 'Church', field: 'profile.church_name', type: 'string' }
	];
	const [state, setState] = useState({
		columns,
		data: []
	});

	const [error, handleError] = useState({ value: false, message: '' });

	useEffect(() => {
		async function fetchUsers() {
			const { data } = await axios({
				method: 'get',
				url: '/api/users/'
			});
			const roleFlattendData = data.map(person => ({
				...person,
				...flattenRole(person.roles, 'role')
			}));
			setState({ ...state, data: roleFlattendData });
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
				<MaterialTable
					title="Users"
					columns={state.columns}
					data={state.data.filter(person => availableRoles.indexOf(person.role) > -1)}
					components={{
						Toolbar: props => (
							<div className={classes.sticky}>
								<MTableToolbar {...props} />
							</div>
						)
					}}
					icons={{
						Add: AddBoxIcon,
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
					detailPanel={rowData => {
						return <UserClassrooms classrooms={rowData.classrooms} student={rowData.id} />;
					}}
					options={{
						// actionsColumnIndex: -1,
						pageSize: 10
					}}
					onRowClick={(event, rowData, togglePanel) => togglePanel()}
					editable={{
						onRowAdd: newData => {
							if (newData.role === '' || newData.role === undefined) {
								return new Promise((_, reject) => {
									return handleCatch(reject, { response: { data: { role: '권한을 정해주세요' } } });
								});
							} else {
								return new Promise((resolve, reject) => {
									axios({
										method: 'post',
										url: '/api/users/',
										data: {
											username: newData.username,
											profile: {
												name: newData['profile.name'],
												gender: newData['profile.gender']
											},
											role: newData.role,
											...(newData.password &&
												newData.password.length > 0 && { password: newData.password })
										}
									})
										.then(({ data: resolved }) => {
											resolve({
												...resolved,
												...newData
											});
											const data = state.data;
											data.push({
												...resolved,
												...newData
											});
											setState({ ...state, data });
										})
										.catch(handleCatch.bind(this, reject));
								});
							}
						},
						onRowUpdate: (newData, oldData) =>
							new Promise((resolve, reject) => {
								console.log(newData);

								let data = new FormData();

								columns.forEach(({ field }) => {
									if (newData[field]) {
										data.append(field, newData[field]);
									}
								});

								// if (newData['profile.name']) {
								// 	data.append('profile.name', newData['profile.name']);
								// }
								// if (newData['profile.gender']) {
								// 	data.append('profile.gender', newData['profile.gender']);
								// }
								// if (newData['profile.phone_number']) {
								// 	data.append('profile.phone_number', newData['profile.phone_number']);
								// }
								// if (newData['imageUrl']) {
								// 	data.append('profile.picture', newData['imageUrl'], newData['imageUrl'].name);
								// }

								// data.append('role', newData.role);
								// if (newData.password && newData.password.length > 0) {
								// 	data.append('password', newData.password);
								// }
								axios({
									method: 'patch',
									url: `/api/users/${newData.id}/`,
									headers: { 'content-type': 'multipart/form-data' },
									data
								})
									.then(({ data: resolved }) => {
										resolve({
											...resolved,
											...newData
										});
										const data = state.data;

										setState({
											...state,
											data: data.map(item => {
												if (item.id === newData.id) {
													return {
														...resolved,
														...newData
													};
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
