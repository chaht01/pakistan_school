import chroma from 'chroma-js';
import { foreground, fonts } from './colors';

export const asyncAttendance = {
	Attended: 'attended',
	Late: 'late',
	Absented: 'absence',
	MakeupClass: 'makeup'
};

export const attendance = {
	attended: 'ATTENDANCE/ATTENDTED',
	none: 'ATTENDANCE/NONE',
	scheduled: 'ATTENDANCE/SCHEDULED',
	absence: 'ATTENDANCE/ABSENCE',
	late: 'ATTENDANCE/LATE',
	makeup: 'ATTENDANCE/MAKEUP'
};

export const reverseAsyncAttendance = {
	[attendance.attended]: 'Attended',
	[attendance.late]: 'Late',
	[attendance.absence]: 'Absented',
	[attendance.makeup]: 'MakeupClass'
};

export const attendMask = alpha => ({
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
});

export const scheduleMask = alpha => ({
	[attendance.none]: chroma(foreground.gray)
		.alpha(alpha)
		.css(),
	[attendance.scheduled]: chroma(foreground.cobalt)
		.alpha(alpha)
		.css()
});

export function colorMatcher(state, alpha = 1.0, mask = attendMask) {
	return mask(alpha)[state];
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
	constructor(stat, data = { date: null, remote: null }) {
		this._stat = stat;
		this._data = {
			date: data.date,
			remote: data.remote
		};
		this._theme = colorMatcher(stat);
	}

	set stat(val) {
		this._stat = val;
		this._theme = colorMatcher(val);
	}

	set date(val) {
		this._data.date = val;
	}

	set data(obj) {
		this._data = {
			date: obj.date,
			remote: obj.remote
		};
	}

	set remote(val) {
		this._data.remote = val;
	}

	get stat() {
		return this._stat;
	}

	get date() {
		return this._data.date;
	}

	get remote() {
		return this._data.remote;
	}

	get theme() {
		return this._theme;
	}

	dateToString() {
		if (this._stat === attendance.late) {
			return this._data.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
		} else if (this._stat === attendance.makeup) {
			return `${this._data.date.toLocaleString('en-us', {
				month: 'long'
			})} ${this._data.date.toLocaleString('en-us', {
				day: 'numeric'
			})}`;
		}
	}
}
