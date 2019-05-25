/* global XMLHttpRequest */
import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import ChipInput from 'material-ui-chip-input';
import _debounce from 'lodash.debounce';
import _throttle from 'lodash.throttle';
import { useState } from 'react';

function renderInput(inputProps) {
	const { value, onChange, chips, ...other } = inputProps;
	return <ChipInput inputValue={value} onUpdateInput={onChange} value={chips.map(c => c.profile.name)} {...other} />;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
	const matches = match(suggestion.profile.name, query);
	const parts = parse(suggestion.profile.name, matches);
	return (
		<MenuItem
			selected={isHighlighted}
			component="div"
			onMouseDown={e => e.preventDefault()} // prevent the click causing the input to be blurred
		>
			<div>
				{parts.map((part, index) => {
					return part.highlight ? (
						<span key={String(index)} style={{ fontWeight: 500 }}>
							{part.text}
						</span>
					) : (
						<span key={String(index)}>{part.text}</span>
					);
				})}
			</div>
		</MenuItem>
	);
}

function renderSuggestionsContainer(options) {
	const { containerProps, children } = options;

	return (
		<Paper {...containerProps} square>
			{children}
		</Paper>
	);
}

function getSuggestionValue(suggestion) {
	return suggestion.profile.name;
}

const styles = theme => ({
	container: {
		flexGrow: 1,
		position: 'relative'
	},
	suggestionsContainerOpen: {
		position: 'absolute',
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(3),
		left: 0,
		right: 0,
		zIndex: 1
	},
	suggestion: {
		display: 'block'
	},
	suggestionsList: {
		margin: 0,
		padding: 0,
		listStyleType: 'none'
	},
	textField: {
		width: '100%'
	}
});

function ReactAutosuggestRemote(props) {
	const { chips, setChips } = props;

	const [textFieldInput, setTextFieldInput] = useState('');
	const suggestions = props.dataSource;

	async function handleSuggestionsFetchRequested({ value }) {}

	const handleSuggestionsClearRequested = () => {};

	const handletextFieldInputChange = (event, { newValue }) => {
		setTextFieldInput(newValue);
	};

	const handleAddChip = chip => {
		let found;
		if (typeof chip === 'string') {
			found = suggestions.find(c => c.profile.name === chip);
		} else {
			found = suggestions.find(c => c.id === chip.id);
		}

		if (found && !chips.find(c => c.id === found.id)) {
			setChips([...chips, found]);
		}
		setTextFieldInput('');
	};

	const handleDeleteChip = (chip, index) => {
		let temp = [...chips];
		temp.splice(index, 1);
		setChips(temp);
	};

	const { classes, ...rest } = props;

	return (
		<Autosuggest
			theme={{
				container: classes.container,
				suggestionsContainerOpen: classes.suggestionsContainerOpen,
				suggestionsList: classes.suggestionsList,
				suggestion: classes.suggestion
			}}
			renderInputComponent={renderInput}
			suggestions={suggestions}
			onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
			onSuggestionsClearRequested={handleSuggestionsClearRequested}
			renderSuggestionsContainer={renderSuggestionsContainer}
			getSuggestionValue={getSuggestionValue}
			renderSuggestion={renderSuggestion}
			onSuggestionSelected={(e, { suggestion }) => {
				handleAddChip(suggestion);
				e.preventDefault();
			}}
			focusInputOnSuggestionClick={false}
			inputProps={{
				classes,
				chips,
				dataSource: suggestions,
				onChange: handletextFieldInputChange,
				value: textFieldInput,
				allowDuplicates: false,
				onAdd: handleAddChip,
				onDelete: handleDeleteChip,

				...rest
			}}
		/>
	);
}

ReactAutosuggestRemote.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ReactAutosuggestRemote);
