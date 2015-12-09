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
import SheetService from '../service/sheetservice.js';

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
            currentSheetPromise: new SheetService().getSheet(ctx.params.id)
        });

        renderer.renderContentView(homePage);
    },

    '/participants': function() {
        var currentSheet = SheetStore.getCurrentSheet();
        var participantsPage = getComponent(ParticipantsPage, { currentSheet: currentSheet });
        renderer.renderContentView(participantsPage);
    },

    '/expenses': function() {
        const currentSheet = SheetStore.getCurrentSheet();
        const participants = ParticipantStore.getParticipants(currentSheet.id);
        var expensesPage = getComponent(ExpensesPage, { currentSheet, participants });
        renderer.renderContentView(expensesPage);
    },

    '/transactions': function() {
        const currentSheet = SheetStore.getCurrentSheet();
        const participants = ParticipantStore.getParticipants(currentSheet.id);
        const expenses = ExpenseStore.getExpenses(currentSheet.id);
        const transactionsPage = getComponent(TransactionsPage, {
            sheet: currentSheet,
            participants,
            expenses
        });
        renderer.renderContentView(transactionsPage);
    },

    '/summary': function() {
        const currentSheet = SheetStore.getCurrentSheet();
        const participants = ParticipantStore.getParticipants(currentSheet.id);
        const expenses = ExpenseStore.getExpenses(currentSheet.id);
        const sheetSummary = getComponent(SummaryPage, {
            participants, expenses
        });
        renderer.renderContentView(sheetSummary);
    }
};


export default routes;