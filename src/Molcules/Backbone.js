import React, { Fragment } from 'react';
import styled from 'styled-components';
import { foreground } from '../const/colors';
import { base } from '../const/size';
import { withStyles } from '@material-ui/core/styles';

function SubGenerativeComponent({ classes, children, ...rest }) {
	return (
		<div className={classes.root} {...rest}>
			{classes.dummy && <div className={classes.dummy} />}

			{children}
		</div>
	);
}

const StructuredBar = withStyles(theme => {
	return {
		root: {
			position: 'fixed',
			width: '100%',
			zIndex: 100
		}
	};
})(function({ classes, height, children, ...rest }) {
	return (
		<div className={classes.root} style={{ height: `${height}px` }} {...rest}>
			{children}
		</div>
	);
});

const StructuredContent = withStyles(theme => {
	return {
		root: {
			display: 'flex',
			flexDirection: 'column',
			height: '100%'
		},
		grow: {
			flex: 1
		}
	};
})(function({ classes, height, children, ...rest }) {
	return (
		<div className={classes.root}>
			<div style={{ height: `${height}px` }} />
			<div className={classes.grow} style={{ height: `calc(100% - ${height}px)` }}>
				{children}
			</div>
		</div>
	);
});

const Backbone = ({ header, content, space }) => {
	return (
		<Fragment>
			<StructuredBar height={space}>{header}</StructuredBar>
			<StructuredContent height={space}>{content}</StructuredContent>
		</Fragment>
	);
};

const SubbarStyles = theme => {
	return {
		root: {
			position: 'fixed',
			left: 0,
			display: 'flex',
			justifyContent: 'space-between',
			alignItems: 'flex-end',
			verticalAlignment: 'bottom',
			width: '100%',
			height: `${base.subbar}px`,
			background: `${foreground.lightGreenGray}`,
			lineHeight: 1.2,
			padding: '0 60px 24px',
			zIndex: 100
		}
	};
};

const Subbar = withStyles(SubbarStyles)(SubGenerativeComponent);

const SubContentStyles = theme => ({
	root: {
		display: 'flex',
		position: 'absolute',
		width: '100%',
		top: 0,
		flexDirection: 'column',
		height: '100%',
		padding: `${base.subbar}px 0px 0`,
		background: '#fff'
	},
	dummy: theme.mixins.toolbar
});

const SubContent = withStyles(SubContentStyles)(SubGenerativeComponent);
export { StructuredBar, StructuredContent };
export default Backbone;
