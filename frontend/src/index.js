import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import App from './components/App';
import ScrollToTop from './components/scrollToTop';
import { store } from './store';
import reportWebVitals from './reportWebVitals';

console.warn = function (...args) {
  	console.log(...args);
};
console.info = function (...args) {
  	console.log(...args);
};

const history = createBrowserHistory({ window });

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  	<Provider store={store}>
      	<Router history={history}>
      		<ScrollToTop />
	        <App />
      	</Router>
  	</Provider>
);
reportWebVitals();