import React from 'react';
import {t} from '../../dictionary/dictionary';
import TransactionsService from '../../service/transactionsservice';
import Constants from '../../constants/AppConstants.js';
import SheetStore from '../../stores/sheetstore.js';
import ExpenseList from '../expenses/expenselist.jsx';
import TransactionsList from '../transactions/transactionslist.jsx';
import SharesTable from '../shares/sharestable.jsx';
import pages from '../../constants/pages';
import Navigation from '../navigation/navigation.jsx';
import {DateUtils, URLUtils} from '../../util/utils.js';
import SheetService from '../../service/sheetservice.js';
import Router from '../../router/router.js';
import SaveButton from '../common/savebutton.jsx';
import MessageContainer from '../common/messagecontainer.jsx';
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

        const sheet = SheetStore.getCurrentSheet();

        this.state = {
            isSavedToServer: false,
            sheet: sheet,
            shareURL: URLUtils.formSheetUrl(sheet.id)
        };

        this._onChange = this._onChange.bind(this);
    }

    componentDidMount() {
        SheetStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        SheetStore.removeChangeListener(this._onChange);
    }

    /**
     * Callback for SheetStore's change events
     * @private
     * @param  {EventType} eventType
     * @return {undefined}
     */
    _onChange(eventType) {
        if (eventType === Constants.EventTypes.CHANGE_EVENT) {
            this.setState({ sheet: SheetStore.getCurrentSheet() });
        }
    }

    /**
     * Save sheet to server
     * @private
     * @return  {undefined}
     */
    _saveSheet() {
        new SheetService().saveSheet(this.state.sheet)
            .then((response) => {
                this.setState({ isSavedToServer: true });
                console.log(response);
            });
    }

    /**
     * Remove current sheet from the server
     * @private
     * @return  {undefined}
     */
    _removeSheet() {
        new SheetService().removeSheet(this.state.sheet)
            .then(() => Router.navigateTo(pages.HOME.href));
    }

    _shareLink() {
        console.log('Share link');
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        var {participants, expenses, settings} = this.state.sheet;
        var transactions = new TransactionsService(this.state.sheet).calculateTransactions();

        return (
            <div id="summary-page">
                <h1>{this.state.sheet.name}</h1>

                <h2>{t('lang.transaction_plural')}:</h2>
                <TransactionsList
                    participants={participants}
                    transactions={transactions}
                    settings={settings}/>

                <h2>{t('lang.expense_plural')}:</h2>
                <ExpenseList
                    expenses={expenses}
                    participants={participants}
                    isRemoveAllowed={false}
                    settings={settings}/>

                <h2>{t('lang.share_plural')}:</h2>

                <SharesTable
                    participants={participants}
                    expenses={expenses} />

                <div id="summary-date">
                    {t('summary.preview_created')} { DateUtils.format(new Date(), t('app.locales.date_format')) }
                </div>

                <div id="server-actions">
                    <div className="row">
                        <div className={ 'twelve columns' + (!this.state.sheet._isNew ? ' hidden' : '')}>
                            <MessageContainer
                                ref={(c) => this._messageContainer = c}
                                type="info"
                                openOnMount={this.state.sheet._isNew}>
                                {t('transactions.save_sheet_to_share')}
                            </MessageContainer>
                        </div>

                        <div className={'twelve columns' + (this.state.sheet._isNew ? ' hidden' : '')}>
                            <label htmlFor="sheet-share-url">{t('transactions.share_url')}:</label>
                            <InputButtonSplit>
                                <input
                                    id="sheet-share-url"
                                    ref={c => this._shareUrlField = c}
                                    type="text"
                                    readOnly
                                    defaultValue={this.state.shareURL}
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
                                beforeSaveText={t('transactions.save_sheet')}
                                afterSaveText={t('lang.saved')}
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