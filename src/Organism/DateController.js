import React, { Fragment, useState, useEffect } from 'react';
import { withSize } from 'react-sizeme';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import WeekPicker from '../Molcules/WeekPicker';
import { withStyles } from '@material-ui/styles';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';
import { DateConsumer } from '../Context/DateContext';

const styles = theme => ({});

function DateController({ size: { width }, classes }) {
	return (
		<DateConsumer>
			{({ globalNow: selectedDate, handleGlobalNow: handleSelectedDate, nextWeek, prevWeek, setToday }) => (
				<Fragment>
					<Hidden smDown>
						<Box component="span">
							<Button variant="outlined" size="small" onClick={setToday}>
								Today
							</Button>
						</Box>
						<Box component="span">
							<IconButton aria-label="Prev Week" size="small" onClick={prevWeek}>
								<ChevronLeftIcon />
							</IconButton>
							<IconButton aria-label="Prev Week" size="small" onClick={nextWeek}>
								<ChevronRightIcon />
							</IconButton>
						</Box>
					</Hidden>
					<Box component="span">
						<WeekPicker selectedDate={selectedDate} handleSelectedDate={handleSelectedDate} />
					</Box>
				</Fragment>
			)}
		</DateConsumer>
	);
}

export default withStyles(styles)(withSize()(DateController));
