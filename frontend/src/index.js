import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'semantic-ui-css/semantic.min.css';
import { BrowserRouter } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';
import App from './App';

ReactDOM.render(
  <BrowserRouter forceRefresh>
    <App props={window} />
  </BrowserRouter>,
  document.getElementById('root'),
);

serviceWorker.unregister();
