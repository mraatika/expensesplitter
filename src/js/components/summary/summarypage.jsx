import React from 'react';
import {t} from '../../dictionary/dictionary';
import TransactionsService from '../../service/transactionsservice';
import Constants from '../../constants/AppConstants.js';
import SheetStore from '../../stores/sheetstore.js';
import ExpenseStore from '../../stores/expensestore.js';
import ParticipantStore from '../../stores/participantstore.js';
import ExpenseList from '../expenses/expenselist.jsx';
import TransactionsList from '../transactions/transactionslist.jsx';
import SharesTable from '../shares/sharestable.jsx';
import pages from '../../constants/pages';
import Navigation from '../navigation/navigation.jsx';
import {DateUtils, URLUtils} from '../../util/utils.js';
import ActionCreators from '../../actions/dataactioncreators.js';
import Router from '../../router/router.js';
import SaveButton from '../common/savebutton.jsx';
import InputButtonSplit from '../common/inputbuttonsplit.jsx';

/**
 * @class SheetSummaryPage
 * @description Sheet summary page
 * @extends {ReactComponent}
 */
export default class SheetSummaryPage extends React.Component {

    /**
     * @constructor
     * @param {Object} props
     * @return {SheetSummaryPage}
     */
    constructor(props) {
        super(props);
        this.state = this._formState(props);
        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetStore.removeChangeListener(this._onChange);
    }

    _formState(props) {
        const currentSheet = SheetStore.getSheet(props.currentSheetId) || {};

        return {
            currentSheet: currentSheet,
            participants: ParticipantStore.getParticipants(currentSheet.id),
            expenses: ExpenseStore.getExpenses(currentSheet.id),
            settings: currentSheet.settings || {},
            isSavedToServer: false,
            isSavingToServer: false,
            shareURL: currentSheet ? URLUtils.formSheetUrl(currentSheet.id) : null
        };
    }

    /**
     * Callback for SheetStore's change events
     * @private
     * @param  {EventType} eventType
     * @return {undefined}
     */
    _onChange(eventType) {
        if (eventType == Constants.EventTypes.SAVE_SHEET_SUCCESS) {
            const isSavedToServer = eventType != Constants.EventTypes.ERROR_EVENT;

            this.setState({
                currentSheet: SheetStore.getCurrentSheet(),
                isSavingToServer: false,
                isSavedToServer: isSavedToServer
            });
        } else {
            this.setState(this._formState(this.props));
        }
    }

    /**
     * Save sheet to server
     * @private
     * @return  {undefined}
     */
    _saveSheet() {
        this.setState({ isSavingToServer: true });
        ActionCreators.saveSheet(this.state.currentSheet);
    }

    /**
     * Remove current sheet from the server
     * @private
     * @return  {undefined}
     */
    _removeSheet() {
        ActionCreators.removeSheet(this.state.currentSheet);
        // optimistic
        Router.navigateTo(pages.HOME.href);
    }

    _shareLink() {
        console.log('Share link');
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {participants, expenses, settings} = this.state;
        const transactions = new TransactionsService().calculateTransactions(expenses, participants);

        return (
            <div id="summary-page">
                <h1>{this.state.currentSheet.name}</h1>

                <h2>{t('lang.transaction_plural')}:</h2>
                <TransactionsList
                    participants={participants}
                    transactions={transactions}
                    currencySymbol={settings.currencySymbol}/>

                <h2>{t('lang.expense_plural')}:</h2>
                <ExpenseList
                    expenses={expenses}
                    participants={participants}
                    isRemoveAllowed={false}
                    currencySymbol={settings.currencySymbol}/>

                <h2>{t('lang.share_plural')}:</h2>

                <SharesTable
                    participants={participants}
                    expenses={expenses} />

                <div id="summary-date">
                    {t('summary.preview_created')} { DateUtils.format(new Date(), t('app.locales.date_format')) }
                </div>

                <div id="server-actions">
                    <div className="row">
                        <div className="twelve columns">
                            <label htmlFor="sheet-share-url">{t('transactions.share_url')}:</label>
                            <InputButtonSplit>
                                <input
                                    id="sheet-share-url"
                                    ref={c => this._shareUrlField = c}
                                    type="text"
                                    readOnly
                                    value={this.state.shareURL}
                                    onClick={() => this._shareUrlField.select() } />
                                <button
                                    type="button"
                                    title={ t('transactions.share_link') }
                                    aria-label={ t('transactions.share_link') }
                                    onClick={this._shareLink.bind(this)}>
                                    <i className="fa fa-lg fa-fw fa-share-alt"/>
                                </button>
                            </InputButtonSplit>
                        </div>
                    </div>

                    <div className="row">
                        <div className="four columns">
                            <SaveButton
                                type="button"
                                className="u-full-width"
                                isSaved={this.state.isSavedToServer}
                                isSaving={this.state.isSavingToServer}
                                beforeSaveText={t('transactions.save_sheet')}
                                afterSaveText={t('lang.saved')}
                                onSavingText={t('lang.saving')}
                                onClick={this._saveSheet.bind(this)} />
                        </div>
                        <div className="four columns">
                            <button className="button-danger u-full-width" onClick={this._removeSheet.bind(this)}>
                                <i className="fa fa-fw fa-lg fa-trash-o"/>&nbsp;
                                { t('transactions.remove_sheet') }
                            </button>
                        </div>
                        <div className="four columns">
                        </div>
                    </div>
                </div>

                <Navigation currentPage={pages.SUMMARY} />
            </div>
        );
    }
}