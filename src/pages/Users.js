import React, { useState, useEffect, Fragment } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Input from '@material-ui/core/Input';
import Hidden from '@material-ui/core/Hidden';
import Button from '@material-ui/core/Button';
import MaterialTable, { MTableToolbar, MTableHeader } from 'material-table';
import MTableEditRow from '../Organism/MTableEditRow';
import MTableBodyRow from '../Organism/MTableBodyRow';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
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
import ViewColumnIcon from '@material-ui/icons/ViewColumn';
import axios from 'axios';
import { withStyles, createStyles } from '@material-ui/styles';
import { foreground, fonts } from '../const/colors';
import UserClassrooms from '../Organism/UserClassrooms';
import { authority, getRolePriority, underRole } from '../const/auth';
import avatarImg from '../static/img/default-avatar.png';
import { format } from 'date-fns';

function renameKeys(obj, { newKey = 'top', transformer = val => val } = { newKey: 'top', transformer: val => val }) {
	if (typeof obj !== 'object') return obj;
	const keyValues = Object.entries(obj).map(([key, value]) => {
		if (key === 'minHeight') {
			return { [newKey]: transformer(value) };
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
	toolbar: {
		position: 'sticky',
		zIndex: 100,
		background: '#fff',
		borderBottom: `1px solid ${foreground.gray}`,
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

function srcToFile(src, fileName, mimeType) {
	return fetch(src)
		.then(function(res) {
			return res.arrayBuffer();
		})
		.then(function(buf) {
			return new File([buf], fileName, { type: mimeType });
		});
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
			format: value => value instanceof File,
			render: rowData => (
				<Avatar alt={rowData.profile.name} src={rowData.profile.picture}>
					{rowData.profile.name[0]}
				</Avatar>
			),
			editComponent: ({ rowData, value, onChange, columnDef }) => {
				const [img, setImg] = useState(rowData ? rowData.profile.picture : avatarImg);
				const [init, setInit] = useState(false);
				if (!rowData && !init) {
					setInit(true);
					srcToFile(avatarImg, 'default.png', 'image/png').then(file => {
						console.log(file);
						onChange(file);
					});
				}
				function handleTempUpload(input) {
					if (input.target.files && input.target.files[0]) {
						onChange(input.target.files[0]);
						var reader = new FileReader();
						reader.onload = function(e) {
							console.log(e.target);
							setImg(e.target.result);
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
								<Avatar
									className={classes.uploadAvatar}
									alt={rowData ? rowData.profile.name : ''}
									src={img}
								>
									{rowData ? rowData.profile.name[0] : ''}
								</Avatar>{' '}
								Upload
							</Button>
						</label>
					</Fragment>
				);
			}
		},
		{ title: 'Name *', field: 'profile.name', required: true, format: value => typeof value === 'string' },
		{
			title: 'Username *',
			field: 'username',
			editable: 'onAdd',
			required: true,
			format: value => typeof value === 'string'
		},
		{
			title: 'Role *',
			field: 'role',
			lookup: role_lookup,
			required: true,
			format: value => typeof value === 'string'
		},
		{
			title: 'Password',
			field: 'password',
			render: rowData => <span>****</span>,
			format: value => typeof value === 'string'
		},
		{
			title: 'Phone',
			field: 'profile.phone_number',
			editable: 'onUpdate',
			format: value => typeof value === 'string'
		},
		{
			title: 'Gender',
			field: 'profile.gender',
			lookup: { Man: 'Man', Woman: 'Woman' },
			format: value => typeof value === 'string'
		},
		{
			title: 'Birthday',
			field: 'profile.birthday',
			type: 'date',
			format: value => value instanceof Date,
			transformer: value => format(value, 'yyyy-MM-dd')
		},
		{ title: 'Age', field: 'profile.age', type: 'numeric', format: value => typeof value === 'number' },
		{ title: 'Hobby', field: 'profile.hobby', type: 'string', format: value => typeof value === 'string' },
		{ title: 'Address', field: 'profile.address', type: 'string', format: value => typeof value === 'string' },
		{ title: 'Religion', field: 'profile.religion', type: 'string', format: value => typeof value === 'string' },
		{ title: 'Church', field: 'profile.church_name', type: 'string', format: value => typeof value === 'string' }
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
							<div className={classes.toolbar}>
								<MTableToolbar {...props} />
							</div>
						),
						EditRow: props => <MTableEditRow {...props} />,
						Row: props => <MTableBodyRow {...props} />
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
						DetailPanel: ChevronRightIcon,
						ViewColumn: ViewColumnIcon
					}}
					detailPanel={rowData => {
						return <UserClassrooms classrooms={rowData.classrooms} student={rowData.id} />;
					}}
					options={{
						columnsButton: true,
						pageSize: 10,
						addRowPosition: 'first',
						detailCellStyle: {
							background: '#fff'
						},
						actionsCellStyle: {
							position: 'sticky',
							left: 0,
							zIndex: 99,
							background: '#fff',
							boxShadow: `1px 0px 0px 0px ${foreground.gray}`
						}
					}}
					onRowClick={(event, rowData, togglePanel) => togglePanel()}
					editable={{
						onRowAdd: newData => {
							let data = new FormData();
							let msg = {};
							columns.forEach(({ field, format, required, transformer = value => value }) => {
								if (newData[field] && format(newData[field])) {
									data.append(field, transformer(newData[field]));
								} else if (required) {
									msg[field] = '필수입력 사항입니다';
								}
							});
							if (Object.keys(msg).length > 0) {
								return new Promise((_, reject) => {
									return handleCatch(reject, { response: { data: msg } });
								});
							} else {
								return new Promise((resolve, reject) => {
									axios({
										method: 'post',
										url: '/api/users/',
										headers: { 'content-type': 'multipart/form-data' },
										data
									})
										.then(({ data: resolved }) => {
											resolve({
												...newData,
												...resolved
											});
											const data = state.data;
											data.push({
												...newData,
												...resolved
											});
											setState({ ...state, data });
										})
										.catch(handleCatch.bind(this, reject));
								});
							}
						},
						onRowUpdate: (newData, oldData) =>
							new Promise((resolve, reject) => {
								let data = new FormData();
								columns.forEach(({ field, format, transformer = value => value }) => {
									if (newData[field] && format(newData[field])) {
										console.log(field, newData[field]);
										data.append(field, transformer(newData[field]));
									}
								});

								axios({
									method: 'patch',
									url: `/api/users/${newData.id}/`,
									headers: { 'content-type': 'multipart/form-data' },
									data
								})
									.then(({ data: resolved }) => {
										resolve({
											...newData,
											...resolved
										});
										const data = state.data;
										console.log({
											...newData,
											...resolved
										});
										setState({
											...state,
											data: data.map(item => {
												if (item.id === newData.id) {
													return {
														...newData,
														...resolved
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
