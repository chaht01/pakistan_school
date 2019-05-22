import React, { Fragment } from 'react';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import AbsenceDate from '../Organism/AbsenceDate';
import { foreground, fonts } from '../const/colors';
import { media } from '../utils/breakpoints';

const CalendarRow = styled.div`
	display: grid;
	grid-template-columns: 240px repeat(7, 1fr);
	${media.md`grid-template-columns: 180px repeat(7, 1fr);`} ${media.sm`grid-template-columns: 100px repeat(7, 1fr);`};
`;

const WeekdaysHeader = styled(CalendarRow)`
	position: fixed;
	width: 100%;
	left: 0;
	background: #fff;
	height: 80px;
	border-bottom: 1px solid #e1e1e7;
	z-index: 99;
`;

const Weekday = styled(Grid)`
	position: relative;
	&:before {
		position: absolute;
		display: block;
		content: '';
		left: 100%;
		bottom: 0;
		height: 20px;
		width: 0;
		border-left: 1px solid #494949;
		opacity: 0.5;
	}
`;
Weekday.Label = styled.span`
	text-transform: uppercase;
	${media.md`font-size: 1em;`} ${media.sm`font-size: .8em;`};
`;
Weekday.Date = styled.span`
	position: relative;
  font-size: 1.4em;
  ${media.md`font-size: 1em;`}
  ${media.sm`font-size: .8em;`}
	font-weight: 300;
  padding: 1em;
  ${media.md`padding: .9em;`}
  ${media.sm`padding: .8em;`}
	z-index: 1;
	&:before {
		position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
		content: '${props => props.date}';
		left: 50%;
		top: 50%;
		transform: translate(-50%, -50%);
		width: 36px;
    height: 36px;
    ${media.md`
    width: 30px;
    height: 30px;
    `}
  ${media.sm`
  width: 24px;
    height: 24px;
  `}
    border-radius: 50px;
    color: ${fonts.darkGray};
    ${props =>
		props.today &&
		`
    color: #fff;
    background: ${foreground.cobalt};`}

	}
`;

const StudentContainer = styled.div`padding-top: 80px;`;

const Student = styled(CalendarRow)`
	height: 100px;
	background: #fff;
	> *:first-child {
		position: relative;
		&:before {
			position: absolute;
			display: block;
			content: '';
			left: 100%;
			bottom: 0;
			height: 100%;
			width: 0;
			border-right: 1px solid #494949;
			opacity: 0.5;
		}
	}
	&:nth-of-type(2n + 1) > *:first-child {
		background: ${foreground.lightGreenGray};

		z-index: 1;
	}
`;

function StudentRow({ name, absenceStatus, startDate }) {
	function onChange(resolved, offset) {}
	return (
		<Student>
			<span>{name}</span>
			{absenceStatus.map((abs, offset) => {
				const targetDate = new Date(startDate);
				targetDate.setDate(targetDate.getDate() + offset);
				return (
					<AbsenceDate initStat={abs} name={name} targetDate={targetDate} onChange={onChange.bind(offset)} />
				);
			})}
		</Student>
	);
}

export function Calendar({ absences = [], today = new Date(), monInit = false }) {
	const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
	let startDate = new Date(today);
	startDate.setDate(startDate.getDate() - (startDate.getDay() - (monInit ? 1 : 0)));

	return (
		<Fragment>
			<WeekdaysHeader>
				<Weekday />
				{weekdays.map((wd, offset) => {
					let date = new Date(startDate);
					date.setDate(startDate.getDate() + offset);
					return (
						<Weekday key={wd} container direction={'column'} justify={'center'} alignItems={'center'}>
							<Weekday.Label>{wd}</Weekday.Label>
							<Weekday.Date date={date.getDate()} today={today.getDate() === date.getDate()} />
						</Weekday>
					);
				})}
			</WeekdaysHeader>
			<StudentContainer>
				{absences.map(({ name, absenceStatus }) => (
					<StudentRow name={name} absenceStatus={absenceStatus} startDate={startDate} />
				))}
			</StudentContainer>
		</Fragment>
	);
}
