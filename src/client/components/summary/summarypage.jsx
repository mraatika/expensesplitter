import React, {PropTypes} from 'react';
import {browserHistory} from 'react-router';
import Clipboard from 'clipboard';
import {t} from 'common/dictionary/dictionary';
import TransactionsService from 'client/service/transactionsservice';
import ParticipantSummaryList from 'client/components/shares/participantsummarylist.jsx';
import TransactionsList from 'client/components/transactions/transactionslist.jsx';
import SharesTable from 'client/components/shares/sharestable.jsx';
import pages from 'client/constants/pages';
import Navigation from 'client/components/navigation/navigation.jsx';
import {DateUtils, URLUtils} from 'client/util/utils';
import SaveButton from 'client/components/common/savebutton.jsx';
import InputButtonSplit from 'client/components/common/inputbuttonsplit.jsx';
import RemovalConfirmationDialog from 'client/components/common/removalconfirmationdialog.jsx';
import ExpensesService from 'client/service/expensesservice';


/**
 * @class SheetSummaryPage
 * @description Sheet summary page
 * @extends {ReactComponent}
 */
class SheetSummaryPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = { urlCopied: false };
    }

    componentDidMount() {
        this.clipboard = new Clipboard('#copy-to-clipboard-button');

        this.clipboard.on('success', () => {
            this.setState({ urlCopied: true });
        });
    }

    componentWillUnmount() {
        this.clipboard.destroy();
    }

    /**
     * Callback for remove sheet button. Open the sheet removal
     * confirmation dialog
     * @private
     */
    _handleRemoveSheetClick() {
        this._removeSheetConfirmationDialog.open();
    }

    /**
     * Callback for sheet remove dialog's confirm. Removes
     * sheet from the server
     * @private
     */
    _onSheetRemovalConfirmed() {
        const {sheet} = this.props;

        this._removeSheetConfirmationDialog.close();
        this.props.removeSheet(sheet);
        browserHistory.push('/');
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {sheet, params, participants, expenses} = this.props;
        const {settings} = sheet;
        const {adminKey} = params;
        const transactions = new TransactionsService().calculateTransactions(expenses, participants);
        const sharesAndBalances = new ExpensesService({participants, expenses}).getAllBalancesAndShares();

        return (
            <div id="summary-page">
                <h1>{sheet.name}</h1>

                <h2>{t('lang.transaction_plural')}:</h2>
                <TransactionsList
                    participants={participants}
                    transactions={transactions}
                    currencySymbol={settings.currencySymbol}/>

                <h2 className="display-inline">{ t('lang.expense_plural') }</h2>
                <ParticipantSummaryList
                    participants={participants}
                    sharesAndBalances={sharesAndBalances}
                    expenses={expenses}
                    currencySymbol={settings.currencySymbol}/>

                <h2>{t('lang.share_plural')}:</h2>
                <SharesTable
                    participants={participants}
                    expenses={expenses}
                    currencySymbol={settings.currencySymbol}/>

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
                            <label htmlFor="sheet-share-url">{t('summary.share_url')}:</label>
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
                                    id="copy-to-clipboard-button"
                                    title={ t('lang.copy') }
                                    aria-label={ t('lang.copy') }
                                    data-clipboard-target="#sheet-share-url">
                                    <i className={'fa fa-fw fa-lg ' + (this.state.urlCopied ? 'fa-check' : 'fa-clipboard')} />
                                    &nbsp;
                                    { t(this.state.urlCopied ? 'lang.copied' : 'lang.copy') }
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
                                beforeSaveText={t('summary.save_sheet')}
                                afterSaveText={t('lang.saved')}
                                onSavingText={t('lang.saving')}
                                onClick={() => this.props.saveSheet(sheet)} />
                        </div>
                        <div className="six columns">
                            <button
                                className={ 'button-danger u-full-width' }
                                disabled={adminKey !== sheet.adminKey}
                                onClick={this._handleRemoveSheetClick.bind(this)}>
                                <i className="fa fa-fw fa-lg fa-trash-o"/>&nbsp;
                                { t('sheet_remove.button') }
                            </button>
                        </div>
                        <div className="four columns">
                        </div>
                    </div>
                </div>

                <RemovalConfirmationDialog
                    ref={ c => this._removeSheetConfirmationDialog = c }
                    onRemoveConfirmed={this._onSheetRemovalConfirmed.bind(this)}
                    header={ t('sheet_remove.confirmation_title') }
                    contentText={ t('sheet_remove.confirmation_msg') }
                    okButtonLabel={ t('sheet_remove.button') }
                />

                <Navigation currentPage={pages.SUMMARY} sheetId={sheet.id}/>
            </div>
        );
    }
}

SheetSummaryPage.propTypes = {
    sheet: PropTypes.object.isRequired,
    participants: PropTypes.array.isRequired,
    expenses: PropTypes.array.isRequired,
    removeSheet: PropTypes.func.isRequired,
    saveSheet: PropTypes.func.isRequired,
    updateSheet: PropTypes.func.isRequired,
    dirty: PropTypes.bool,
    isSavingToServer: PropTypes.bool
};

export default SheetSummaryPage;