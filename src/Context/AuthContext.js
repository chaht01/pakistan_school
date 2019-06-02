import React, { useState } from 'react';
import { authority, getRolePriority } from '../const/auth';
import axios from 'axios';

const AuthContext = React.createContext();
const local = true;
function AuthProvider({ children }) {
	const { UNAUTH, AUTH, ADMIN, INSTRUCTOR, STUDENT } = authority;
	const savedToken = localStorage.getItem('token');
	const savedUser = localStorage.getItem('user');
	const savedRole =
		localStorage.getItem('roles') === null
			? UNAUTH
			: authority[getRolePriority(localStorage.getItem('roles').split(',')).toUpperCase()];
	setupDefault(savedToken);
	const [auth, setAuth] = useState(savedRole);
	if (savedToken !== null && savedToken.length > 0 && savedUser !== null) {
		axios
			.post('/api/api-token-verify/', {
				token: savedToken
			})
			.then(({ data: { token, user, roles } }) => {
				if (roles.length > 0) {
					success(token, user, roles);
				} else {
					throw new Error();
				}
			})
			.catch(() => {
				fail();
			});
	}

	function setupDefault(token) {
		axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
		axios.defaults.baseURL = local ? 'http://teaching.talk4u.kr' : 'http://www.newacts.kr:8080';
	}

	function success(token, user, roles) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('roles', roles);
		setupDefault(token);
		setAuth(authority[getRolePriority(roles).toUpperCase()]);
	}

	function fail() {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('roles');
		setAuth(UNAUTH);
	}

	const validateAuth = baseArr => baseArr.reduce((acc, curr) => acc || auth.startsWith(curr), false);
	const login = async (username, password) => {
		const { data: { token, user, roles } } = await axios
			.post('/api/api-token-auth/', {
				username,
				password
			})
			.catch(err => ({ data: { token: '', user: null, roles: [] } }));

		if (token.length > 0 && user !== null && roles.length > 0) {
			success(token, user, roles);
		} else {
			fail();
		}
	};
	const logout = () => fail();
	return (
		<AuthContext.Provider value={{ authState: auth, validateAuth, login, logout }}>{children}</AuthContext.Provider>
	);
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
