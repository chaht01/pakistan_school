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
