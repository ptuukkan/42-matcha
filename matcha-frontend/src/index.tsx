import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css'
import './app/layout/style.css';
import App from './app/layout/App';
import { createBrowserHistory } from 'history';

export const history = createBrowserHistory();

ReactDOM.render(
    <App />,
  document.getElementById('root')
);
