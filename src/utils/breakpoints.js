import { base } from '../const/size';
import { css } from 'styled-components';
export const fontDegrader = amount => {
	return (function grader(cnt, size) {
		if (cnt === 0) return size;
		return grader(cnt - 1, size / 1.618);
	})(amount, base.fonts);
};

const sizes = {
	sm: 600,
	md: 960,
	lg: 1280,
	xl: 1920
};

// Iterate through the sizes and create a media template
export const media = Object.keys(sizes).reduce((acc, label) => {
	acc[label] = (...args) => css`@media (max-width: ${sizes[label] / 16}em) {${css(...args)};}`;

	return acc;
}, {});
