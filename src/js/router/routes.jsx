import React from 'react';
import SheetStore from '../stores/sheetstore.js';
import ParticipantStore from '../stores/participantstore.js';
import ExpenseStore from '../stores/expensestore.js';
import renderer from '../util/renderer';
import HomePage from '../components/home/homepage.jsx';
import ParticipantsPage from '../components/participants/participantspage.jsx';
import ExpensesPage from '../components/expenses/expensespage.jsx';
import TransactionsPage from '../components/transactions/transactionspage.jsx';
import SummaryPage from '../components/summary/summarypage.jsx';

/**
 *  Use factory to create component with data
 *  @param {Component} Component Component class
 *  @param {Object} data Properties for the component
 *  @returns {Component} Instance of Component class
 */
var getComponent = function(Component, data) {
    let componentFactory = React.createFactory(Component);
    return componentFactory(data);
};

/**
 * Routes and their callback functions
 * @type {Object}
 */
var routes = {

    '/': function() {
        var homePage = getComponent(HomePage);
        renderer.renderContentView(homePage);
    },

    '/sheet/:id': function(ctx) {
        const homePage = getComponent(HomePage, {
            currentSheetId: ctx.params.id
        });

        renderer.renderContentView(homePage);
    },

    '/sheet/:id/participants': function() {
        const participantsPage = getComponent(ParticipantsPage);
        renderer.renderContentView(participantsPage);
    },

    '/sheet/:id/expenses': function() {
        const expensesPage = getComponent(ExpensesPage);
        renderer.renderContentView(expensesPage);
    },

    '/sheet/:id/transactions': function() {
        const transactionsPage = getComponent(TransactionsPage);
        renderer.renderContentView(transactionsPage);
    },

    '/sheet/:id/summary': function() {
        const summaryPage = getComponent(SummaryPage);
        renderer.renderContentView(summaryPage);
    }
};


export default routes;