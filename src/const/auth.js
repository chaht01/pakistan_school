export const authority = {
	UNAUTH: 'UNAUTH',
	AUTH: 'AUTH',
	ADMIN: 'AUTH/ADMIN',
	INSTRUCTOR: 'AUTH/INSTRUCTOR',
	STUDENT: 'AUTH/STDUENT'
};

export const defaultRoute = {
	[authority.UNAUTH]: '/login',
	[authority.AUTH]: '/',
	[authority.ADMIN]: '/',
	[authority.INSTRUCTOR]: '/classroom',
	[authority.STUDENT]: '/'
};

export const getRolePriority = roles => {
	const priority = ['Admin', 'Instructor', 'Student'];
	return priority[roles.map(role => priority.indexOf(role)).reduce((acc, curr) => (acc > curr ? curr : acc))];
};

export const getAsyncRole = {
	[authority.UNAUTH]: 'Unauthorized',
	[authority.AUTH]: 'Authorized',
	[authority.ADMIN]: 'Admin',
	[authority.INSTRUCTOR]: 'Instructor',
	[authority.STUDENT]: 'Student'
};

export const underRole = (role, selfInclusive) => {
	const priority = ['Admin', 'Instructor', 'Student'];
	let found = false;
	return priority.filter(item => {
		if (item === role) {
			found = true;
			if (!selfInclusive) return false;
		}
		if (found) return true;
		return false;
	});
};
