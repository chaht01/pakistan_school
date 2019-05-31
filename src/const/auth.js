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
