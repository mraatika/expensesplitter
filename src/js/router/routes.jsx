import React from 'react';
import SheetStore from '../stores/sheetstore.js';
import renderer from '../util/renderer';
import TransactionsService from '../service/transactionsservice';
import ExpensesService from '../service/expensesservice';
import HomePage from '../components/home/homepage.jsx';
import ParticipantsPage from '../components/participants/participantspage.jsx';
import ExpensesPage from '../components/expenses/expensespage.jsx';
import {TransactionsPage} from '../components/transactions/transactionspage.jsx';
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
        console.log('page: /');
        var homePage = getComponent(HomePage);
        renderer.renderContentView(homePage);
    },

    '/participants': function() {
        console.log('page: /participants');
        var currentSheet = SheetStore.getCurrentSheet();
        var participantsPage = getComponent(ParticipantsPage, { currentSheet: currentSheet });
        renderer.renderContentView(participantsPage);
    },

    '/expenses': function() {
        console.log('page: /expenses');
        var currentSheet = SheetStore.getCurrentSheet();
        var expensesPage = getComponent(ExpensesPage, { currentSheet: currentSheet });
        renderer.renderContentView(expensesPage);
    },

    '/transactions': function() {
        console.log('page: /transactions');
        var currentSheet = SheetStore.getCurrentSheet();
        var transactions = new TransactionsService(currentSheet).calculateTransactions();
        var sharesAndBalances = new ExpensesService(currentSheet).getAllBalancesAndShares();
        var transactionsPage = getComponent(TransactionsPage, {
            currentSheet: currentSheet,
            transactions: transactions,
            sharesAndBalances: sharesAndBalances
        });
        renderer.renderContentView(transactionsPage);
    },

    '/summary': function() {
        console.log('page: /summary');
        var currentSheet = SheetStore.getCurrentSheet();
        var sheetSummary = getComponent(SummaryPage, {
            sheet: currentSheet
        });
        renderer.renderContentView(sheetSummary);
    }
};


export default routes;