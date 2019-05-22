import chroma from 'chroma-js';
import { foreground, fonts } from './colors';

export const attendance = {
	attended: 'ATTENDANCE/ATTENDTED',
	none: 'ATTENDANCE/NONE',
	scheduled: 'ATTENDANCE/SCHEDULED',
	absence: 'ATTENDANCE/ABSENCE',
	late: 'ATTENDANCE/LATE',
	makeup: 'ATTENDANCE/MAKEUP'
};

export function colorMatcher(state, alpha = 1.0) {
	const attendMask = {
		[attendance.attended]: chroma(foreground.emerald)
			.alpha(alpha)
			.css(),
		[attendance.none]: chroma(foreground.gray)
			.alpha(alpha)
			.css(),
		[attendance.scheduled]: chroma('#fff')
			.alpha(alpha)
			.css(),
		[attendance.absence]: chroma(foreground.red)
			.alpha(alpha)
			.css(),
		[attendance.late]: chroma(foreground.yellow)
			.alpha(alpha)
			.css(),
		[attendance.makeup]: chroma(foreground.purple)
			.alpha(alpha)
			.css()
	};
	return attendMask[state];
}
export function fontMatcher(state, alpha = 1.0) {
	const attendMask = {
		[attendance.attended]: '#fff',
		[attendance.none]: fonts.darkGray,
		[attendance.scheduled]: fonts.darkGray,
		[attendance.absence]: '#fff',
		[attendance.late]: '#fff',
		[attendance.makeup]: '#fff'
	};
	return attendMask[state];
}

export class AttStat {
	constructor(stat, data = null) {
		this._stat = stat;
		if ([attendance.late, attendance.makeup].indexOf(stat) > -1) {
			this._data = data;
		}
		this._theme = colorMatcher(stat);
	}

	set stat(val) {
		this._stat = val;
		this._theme = colorMatcher(val);
	}

	set data(val) {
		this._data = val;
	}

	get stat() {
		return this._stat;
	}

	get data() {
		return this._data;
	}

	get theme() {
		return this._theme;
	}

	dataToString() {
		if (this._stat === attendance.late) {
			return this._data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
		} else if (this._stat === attendance.makeup) {
			return `${this._data.toLocaleString('en-us', { month: 'long' })} ${this._data.toLocaleString('en-us', {
				day: 'numeric'
			})}`;
		}
	}
}
