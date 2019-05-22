import React, { Fragment, useState, useEffect } from 'react';
import MobileStepper from '@material-ui/core/MobileStepper';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import SwipeableViews from 'react-swipeable-views';
import Button from '@material-ui/core/Button';
import { autoPlay, bindKeyboard } from 'react-swipeable-views-utils';
import styled from 'styled-components';

import AbsenceCard from '../Organism/AbsenceCard';

const AutoPlaySwipeableViews = styled(bindKeyboard(autoPlay(SwipeableViews)))`
	flex: 1;
	overflow: hidden;
	> * {
		height: 100%;
	}
`;

const Carousel = styled.div`
	height: 100%;
	padding: 0 30px;
`;

Carousel.Wrapper = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-gap: 30px;
	height: 100%;
`;

export default function PreviewStepper({ classInfo = [] }) {
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

	const maxSteps = classInfo.length;

	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<AutoPlaySwipeableViews
				index={activeStep}
				onChangeIndex={handleStepChange}
				springConfig={{ duration: '.5s', easeFunction: 'ease-in-out', delay: '0s' }}
				interval={10000}
				enableMouseEvents
			>
				{classInfo.map((group, index) => (
					<Carousel key={index}>
						<Carousel.Wrapper>
							{group.map((cls, gidx) => (
								<AbsenceCard
									key={gidx}
									title={cls.title}
									lecturer={cls.lecturer}
									schedule={cls.schedule}
									absences={cls.absences}
								/>
							))}
						</Carousel.Wrapper>
					</Carousel>
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
