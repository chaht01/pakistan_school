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
	return <ChipInput inputValue={value} onUpdateInput={onChange} value={chips} {...other} />;
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
	const matches = match(suggestion.name, query);
	const parts = parse(suggestion.name, matches);

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
	return suggestion.name;
}

// function getSuggestions(value) {
// 	const inputValue = value.trim().toLowerCase();
// 	const inputLength = inputValue.length;
// 	let count = 0;

// 	return inputLength === 0
// 		? []
// 		: suggestions.filter(suggestion => {
// 				const keep = count < 5 && suggestion.name.toLowerCase().slice(0, inputLength) === inputValue;

// 				if (keep) {
// 					count += 1;
// 				}

// 				return keep;
// 			});
// }

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
	const CancelToken = axios.CancelToken;
	const source = CancelToken.source();
	const [chips, setChips] = useState([]);
	const [textFieldInput, setTextFieldInput] = useState('');
	const [suggestions, setSuggestions] = useState([]);

	async function handleSuggestionsFetchRequested({ value }) {
		axios
			.get(`https://restcountries.eu/rest/v2/name/${value}`, { cancelToken: source.token })
			.then(response => {
				setSuggestions(response.data || []);
			})
			.catch(function(thrown) {
				if (axios.isCancel(thrown)) {
					console.log('Request canceled', thrown.message);
				} else {
					// handle error
				}
			});
	}

	const handleSuggestionsClearRequested = () => {
		setSuggestions([]);
	};

	const handletextFieldInputChange = (event, { newValue }) => {
		setTextFieldInput(newValue);
	};

	const handleAddChip = chip => {
		const found = suggestions.find(c => {
			return c.name.toLowerCase() === chip.toLowerCase();
		});
		setChips([...chips, found.name]);
		setTextFieldInput('');
	};

	const handleDeleteChip = (chip, index) => {
		let temp = [...chips];
		temp.splice(index, 1);
		setChips(temp);
	};

	const validateChip = chip =>
		!chips.find(c => c.toLowerCase() === chip.toLowerCase()) &&
		suggestions.find(c => c.name.toLowerCase() === chip.toLowerCase());

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
			onSuggestionSelected={(e, { suggestionValue }) => {
				handleAddChip(suggestionValue);
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
				onAdd: chip => handleAddChip(chip),
				onDelete: (chip, index) => handleDeleteChip(chip, index),
				onBeforeAdd: chip => {
					const ret = validateChip(chip);
					if (!ret) {
						setTextFieldInput('');
					}
					return ret;
				},
				...rest
			}}
		/>
	);
}

ReactAutosuggestRemote.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(ReactAutosuggestRemote);
