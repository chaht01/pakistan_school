import React, { Fragment, useState, useEffect } from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Button from '@material-ui/core/Button';
import { autoPlay, bindKeyboard } from 'react-swipeable-views-utils';
import styled from 'styled-components';
import withWidth, { isWidthUp, isWidthDown } from '@material-ui/core/withWidth';

import AbsenceCard from '../Organism/AbsenceCard';
import { withStyles } from '@material-ui/styles';
import Grid from '@material-ui/core/Grid';

const AutoPlaySwipeableViews = styled(bindKeyboard(autoPlay(SwipeableViews)))`
	flex: 1;
	overflow: hidden;
	> * {
		height: 100%;
	}
`;

const Carousel = styled.div`height: 100%;`;

Carousel.Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 30px;
	height: 100%;
`;

const styles = theme => ({
	carousel: {
		height: '100%',
		padding: '0 30px'
	}
});

function PreviewStepper({ classes, width, classInfo = [] }) {
	const [activeStep, setActiveStep] = useState(0);
	function handleNext() {
		setActiveStep(activeStep + 1);
	}

	function handleBack() {
		setActiveStep(activeStep - 1);
	}

	function handleStepChange(step) {
		setActiveStep(step);
	}

	let classPerGroup = 1;
	if (isWidthDown('xs', width)) {
		classPerGroup = 1;
	} else if (isWidthUp('xs', width) && isWidthDown('sm', width)) {
		classPerGroup = 2;
	} else {
		classPerGroup = 3;
	}
	const groupedClass = classInfo.reduce((acc, curr) => {
		if (acc.length === 0 || acc[acc.length - 1].length === classPerGroup) {
			acc.push([]);
		}
		acc[acc.length - 1].push(curr);
		return acc;
	}, []);

	const maxSteps = groupedClass.length;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<AutoPlaySwipeableViews
				index={activeStep}
				onChangeIndex={handleStepChange}
				springConfig={{ duration: '.5s', easeFunction: 'ease-in-out', delay: '0s' }}
				interval={5000000}
				enableMouseEvents
			>
				{groupedClass.map((group, index) => (
					<Grid container className={classes.carousel} spacing={6} key={index}>
						{group.map((cls, gidx) => (
							<Grid item xs={12} sm={6} md={4}>
								<AbsenceCard
									key={cls.id}
									id={cls.id}
									title={cls.name}
									lecturers={cls.instructors}
									schedule={cls.schedule}
									absences={cls.absences}
								/>
							</Grid>
						))}
					</Grid>
				))}
			</AutoPlaySwipeableViews>
			<MobileStepper
				steps={maxSteps}
				position="static"
				activeStep={activeStep}
				nextButton={
					<Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1}>
						Next<KeyboardArrowRight />
					</Button>
				}
				backButton={
					<Button size="small" onClick={handleBack} disabled={activeStep === 0}>
						<KeyboardArrowLeft />Back
					</Button>
				}
			/>
		</div>
	);
}

export default withWidth()(withStyles(styles)(PreviewStepper));
