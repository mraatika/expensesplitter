import React from 'react';
import {browserHistory} from 'react-router';
import {t} from '../../dictionary/dictionary';
import TransactionsService from '../../service/transactionsservice';
import ExpenseList from '../expenses/expenselist.jsx';
import TransactionsList from '../transactions/transactionslist.jsx';
import SharesTable from '../shares/sharestable.jsx';
import pages from '../../constants/pages';
import Navigation from '../navigation/navigation.jsx';
import {DateUtils, URLUtils} from '../../util/utils.js';
import SaveButton from '../common/savebutton.jsx';
import InputButtonSplit from '../common/inputbuttonsplit.jsx';

/**
 * @class SheetSummaryPage
 * @description Sheet summary page
 * @extends {ReactComponent}
 */
export default class SheetSummaryPage extends React.Component {
    /**
     * Remove current sheet from the server
     * @private
     * @return  {undefined}
     */
    _removeSheet() {
        this.props.removeSheet(this.props.sheet);
        // optimistic
        browserHistory.push('/');
    }

    _shareLink() {
        console.log('Share link');
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {sheet} = this.props;
        const {participants, expenses, settings} = sheet;
        const transactions = new TransactionsService().calculateTransactions(expenses, participants);

        return (
            <div id="summary-page">
                <h1>{sheet.name}</h1>

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

                <div>
                    <label htmlFor="sheet-additional-information">{ t('summary.additional_information') + ':' }</label>
                    <textarea
                        id="sheet-additional-information"
                        onChange={(e) => this.props.updateSheet(this.props.sheet, { additionalInformation: e.target.value })}
                        className="u-full-width"
                        value={sheet.additionalInformation}>
                    </textarea>
                </div>

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
                                    value={`${URLUtils.formSheetUrl(sheet.id)}/summary`}
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
                        <div className="six columns">
                            <SaveButton
                                type="button"
                                className="u-full-width"
                                isSaved={!this.props.dirty}
                                isSaving={this.props.isSavingToServer}
                                beforeSaveText={t('transactions.save_sheet')}
                                afterSaveText={t('lang.saved')}
                                onSavingText={t('lang.saving')}
                                onClick={() => this.props.saveSheet(sheet)} />
                        </div>
                        <div className="six columns">
                            <button
                                className={ 'button-danger u-full-width' }
                                onClick={this._removeSheet.bind(this)}>
                                <i className="fa fa-fw fa-lg fa-trash-o"/>&nbsp;
                                { t('transactions.remove_sheet') }
                            </button>
                        </div>
                        <div className="four columns">
                        </div>
                    </div>
                </div>

                <Navigation currentPage={pages.SUMMARY} sheetId={sheet.id}/>
            </div>
        );
    }
}