import React, { useState } from 'react';
import { authority } from '../const/auth';
const AuthContext = React.createContext();

function AuthProvider({ children }) {
	const { UNAUTH, AUTH, ADMIN, INSTRUCTOR, STUDENT } = authority;
	const [auth, setAuth] = useState(ADMIN);

	const validateAuth = baseArr => baseArr.reduce((acc, curr) => acc || auth.startsWith(curr), false);
	const login = (username, pw) => {
		switch (username) {
			case '1':
				setAuth(ADMIN);
				break;
			case '2':
				setAuth(INSTRUCTOR);
				break;
			case '3':
				setAuth(STUDENT);
				break;
			case '4':
				setAuth(AUTH);
				break;
		}
	};
	const logout = (username, pw) => setAuth(UNAUTH);
	return (
		<AuthContext.Provider value={{ authState: auth, validateAuth, login, logout }}>{children}</AuthContext.Provider>
	);
}

const AuthConsumer = AuthContext.Consumer;

export { AuthProvider, AuthConsumer };
