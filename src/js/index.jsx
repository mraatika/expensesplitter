// disable eslinting here because even when react is not used on this page
// removing it from imports will cause an error
import React from 'react'; // eslint-disable-line no-unused-vars
import ExpenseSplitterRouter from 'router/expensesplitterrouter.jsx';
import renderer from 'util/renderer.js';

renderer.render(<ExpenseSplitterRouter />, 'main');
