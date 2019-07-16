import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { foreground } from './const/colors';
import { AuthProvider } from './Context/AuthContext';
import { DateProvider } from './Context/DateContext';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { StylesProvider, createGenerateClassName } from '@material-ui/styles';
import DateFnsUtils from '@date-io/date-fns';
const generateClassName = createGenerateClassName({
	productionPrefix: 'mt'
});
const theme = createMuiTheme({
	palette: {
		primary: { main: foreground.cobalt },
		secondary: { main: foreground.white }
	}
});

ReactDOM.render(
	<StylesProvider generateClassName={generateClassName}>
		<MuiPickersUtilsProvider utils={DateFnsUtils}>
			<MuiThemeProvider theme={theme}>
				<AuthProvider>
					<DateProvider>
						<App />
					</DateProvider>
				</AuthProvider>
			</MuiThemeProvider>
		</MuiPickersUtilsProvider>
	</StylesProvider>,
	document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
