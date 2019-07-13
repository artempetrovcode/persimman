// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';
// import App from './App';

function x(s: string): number {
    return 1;
}

const rootElement = document.getElementById('root');

if (rootElement) {
	ReactDOM.render(
		<div>hello</div>,
		rootElement
	);
}