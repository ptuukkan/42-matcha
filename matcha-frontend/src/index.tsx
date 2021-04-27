import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import 'rc-slider/assets/index.css';
import './app/layout/style.css';
import 'react-toastify/dist/ReactToastify.min.css';
import 'react-widgets/dist/css/react-widgets.css';
import App from './app/layout/App';
import { createBrowserHistory } from 'history';
import dateFnsLocalizer from 'react-widgets-date-fns';
import { Router } from 'react-router-dom';

dateFnsLocalizer();

export const history = createBrowserHistory();

ReactDOM.render(
	<Router history={history}>
		<App />
	</Router>,
	document.getElementById('root')
);
