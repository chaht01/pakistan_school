import React, { useState } from 'react';
import { authority, getRolePriority } from '../const/auth';
import axios from 'axios';

const AuthContext = React.createContext();

function AuthProvider({ children }) {
	const { UNAUTH, AUTH, ADMIN, INSTRUCTOR, STUDENT } = authority;
	const savedToken = localStorage.getItem('token');
	const savedUser = localStorage.getItem('user');
	const savedRole =
		localStorage.getItem('roles') === null
			? UNAUTH
			: authority[getRolePriority(localStorage.getItem('roles').split(','))];
	axios.defaults.headers.common['Authorization'] = `JWT ${savedToken}`;
	const [auth, setAuth] = useState(savedRole);
	if (savedToken !== null && savedToken.length > 0 && savedUser !== null) {
		axios
			.post('http://teaching.talk4u.kr/api/api-token-verify/', {
				token: savedToken
			})
			.then(({ data: { token, user, roles } }) => {
				success(token, user, roles);
			})
			.catch(() => {
				fail();
			});
	}

	function success(token, user, roles) {
		localStorage.setItem('token', token);
		localStorage.setItem('user', JSON.stringify(user));
		localStorage.setItem('roles', roles);
		axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
		setAuth(authority[getRolePriority(roles)]);
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
			.post('http://teaching.talk4u.kr/api/api-token-auth/', {
				username,
				password
			})
			.catch(err => ({ data: { token: '', user: null, roles: [] } }));

		if (token.length > 0 && user !== null) {
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
