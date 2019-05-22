export const foreground = {
	white: '#ffffff',
	lightGreenGray: '#f1f3f4',
	lightGray: '#f1f1f5',
	gray: '#e1e1e7',
	midGray: '#dddddd',

	emerald: '#3fe6b7',
	cobalt: '#6c74f7',
	purple: '#6e4486',
	yellow: '#f2b32a',
	red: '#df422b'
};

export function hover(color) {
	switch (color) {
		case '#6c74f7':
			return '#5a65ca'; // cobalt
		case '#6e4486':
			return '#5a3a70'; // purple
		case '#f2b32a':
			return '#ce9228'; // yellow
		case '#df422b':
			return '#b73225'; // red
		default:
			return color;
	}
}

export const fonts = {
	darkGray: '#494949',
	black: '#333333'
};
