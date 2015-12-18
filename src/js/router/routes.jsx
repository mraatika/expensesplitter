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

    '/sheet/:id/participants': function(ctx) {
        const participantsPage = getComponent(ParticipantsPage, {
            currentSheetId: ctx.params.id
        });
        renderer.renderContentView(participantsPage);
    },

    '/sheet/:id/expenses': function(ctx) {
        const expensesPage = getComponent(ExpensesPage, {
            currentSheetId: ctx.params.id
        });
        renderer.renderContentView(expensesPage);
    },

    '/sheet/:id/transactions': function(ctx) {
        const transactionsPage = getComponent(TransactionsPage, {
            currentSheetId: ctx.params.id
        });
        renderer.renderContentView(transactionsPage);
    },

    '/sheet/:id/summary': function(ctx) {
        const summaryPage = getComponent(SummaryPage, {
            currentSheetId: ctx.params.id
        });
        renderer.renderContentView(summaryPage);
    }
};


export default routes;