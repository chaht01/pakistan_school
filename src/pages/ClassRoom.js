import React, { Fragment } from 'react';
import { PropTypes } from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import Backbone, { StructuredBar, StructuredContent } from '../Molcules/Backbone';
import AbsenceCounter from '../Organism/AbsenceCounter';
import HorizonLabelGroup from '../Molcules/HorizonLabelGroup';
import ScheduleBullet from '../Molcules/ScheduleBullet';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import { Calendar } from '../Organism/Calendar';
import { base } from '../const/size';
import { foreground } from '../const/colors';

const styles = theme => ({
	statBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-end',
		verticalAlignment: 'bottom',
		width: '100%',
		height: `${base.subbar}px`,
		background: `${foreground.lightGreenGray}`,
		lineHeight: 1.2,
		padding: '0 60px 24px'
	}
});

function ClassRoom({ classes, title, lecturer, schedule, absences }) {
	const { initDays, startTime, endTime } = schedule;
	return (
		<Fragment>
			<Backbone
				header={
					<div className={classes.statBar}>
						<HorizonLabelGroup big={title} small={lecturer} reverse={true} />

						<Grid container justify={'flex-end'} alignItems={'center'} spacing={0}>
							<Grid item>
								<AbsenceCounter />
							</Grid>
							<Grid item style={{ marginLeft: '2em' }}>
								<Grid
									container
									direction={'column'}
									alignItems={'center'}
									justify={'center'}
									spacing={0}
								>
									<ScheduleBullet editable={false} initDays={initDays} />
									<Typography variant="button" align={'center'}>
										{`${new Date(startTime).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
											hour12: false
										})} ~ ${new Date(endTime).toLocaleTimeString([], {
											hour: '2-digit',
											minute: '2-digit',
											hour12: false
										})}`}
									</Typography>
								</Grid>
							</Grid>
						</Grid>
					</div>
				}
				content={<Calendar absences={absences} />}
				space={base.subbar}
			/>
		</Fragment>
	);
}

ClassRoom.propTypes = {
	title: PropTypes.string.isRequired,
	lecturer: PropTypes.string.isRequired,
	schedule: PropTypes.shape({
		initDays: PropTypes.array,
		startTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
		endTime: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number])
	}).isRequired,
	absences: PropTypes.array.isRequired
};

export default withStyles(styles)(ClassRoom);
