'use strict';

import React from 'react';
import DataStore from '../../stores/datastore';
import ActionCreator from '../..//actions/dataactioncreators';
import Constants from '../../constants/AppConstants';
import page from 'page';
import pages from '../../constants/pages';
import {t} from '../../dictionary/dictionary';
import {LoadSheetDialog} from './loadsheetdialog.jsx';
import {MessageContainer} from '../common/messagecontainer.jsx';
import {RemoveSheetConfirmationDialog} from './removesheetconfirmationdialog.jsx';

export class HomePage extends React.Component {

    constructor() {
        super();
        this.state = this.getDefaultState();
        this._onChange = this._onChange.bind(this);
    }

    getDefaultState() {
        let currentSheet = DataStore.getCurrentSheet();
        let allSheets = DataStore.getSheets();

        return {
            currentSheet: currentSheet,
            currentSheetName: (currentSheet || {}).name,
            sheets: allSheets
        };
    }

    _onChange(eventType) {
        this.refs.infoMessageContainer.close();

        this.setState(this.getDefaultState());

        if (eventType === Constants.EventTypes.SET_ACTIVE_SHEET_EVENT) {
            this.refs.loadSheetDialog.close();
        }

        if (eventType === Constants.EventTypes.ADD_SHEET_EVENT) {
            page(pages.PARTICIPANTS.href);
        }

    }

    componentDidMount() {
        DataStore.addChangeListener(this._onChange);
    }

    componentWillUnmount() {
        DataStore.removeChangeListener(this._onChange);
    }

    editCurrentSheetAndContinue() {
        // move to participants section
        if (this.state.currentSheet) page(pages.PARTICIPANTS.href);
    }

    addSheet() {
        var sheetName = this.state.currentSheetName;
        if (sheetName) ActionCreator.addSheet(sheetName);
    }

    handleFormSubmit(e) {
        e.preventDefault();

        if (this.state.currentSheet) {
            this.editCurrentSheetAndContinue();
            return;
        }

        this.addSheet();
    }

    handleLoadSheetClick(e) {
        e.preventDefault();
        this.refs.loadSheetDialog.open();
    }

    handleRemoveSheetClick() {
        this.refs.removeSheetConfirmationDialog.open();
    }

    handleAddSheetClick() {
        var self = this;

        if (this.state.currentSheet) {
            this.setState({
                currentSheet: null,
                currentSheetName: null
            }, function() {
                self.refs.infoMessageContainer.open();
                self.refs.sheetNameInput.focus();
            });
        }

    }

    handleCurrentSheetNameChange(e) {
        this.setState({ currentSheetName: e.target.value });
    }

    onSheetRemovalConfirmed() {
        if (this.state.currentSheet) ActionCreator.removeSheet(this.state.currentSheet.id);
    }

    render() {
        return (
            <section className="home-page">
                <p>
                    Insert translated app description here.
                </p>

                <MessageContainer ref="infoMessageContainer" type="info">
                    { t('home.prev_sheet_saved') + ' ' }
                    <a href="/" onClick={this.handleLoadSheetClick.bind(this)}>{ t('home.load_sheet_action') }</a>.
                </MessageContainer>

                <form onSubmit={this.handleFormSubmit.bind(this)}>
                    <div className="row">
                        <div className="three columns">
                            <label htmlFor="sheet-name">
                            { t( this.state.currentSheet ? 'lang.current_sheet' : 'home.name_your_sheet') }:
                            </label>
                        </div>

                        <div className="nine columns">
                            <input
                                id="sheet-name"
                                className="u-full-width"
                                required
                                autoFocus={true}
                                ref="sheetNameInput"
                                type="text"
                                placeholder={ t('home.sheet_name_placeholder') + '...' }
                                value={this.state.currentSheetName}
                                disabled={!!this.state.currentSheet}
                                onChange={this.handleCurrentSheetNameChange.bind(this)} />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="button-primary u-full-width"
                        required={true}>
                        { t(this.state.currentSheet ? 'home.button.edit' : 'home.button.add_and_continue') }
                    </button>
                </form>
                <div className="row">
                    <div className="four columns">
                        <button
                            id="button-add-sheet"
                            className="u-full-width"
                            disabled={!this.state.currentSheet}
                            onClick={this.handleAddSheetClick.bind(this)}>
                            <i className="fa fa-file-o fa-fw fa-lg" />
                            { t('home.button.add') }
                        </button>
                    </div>

                    <div className="four columns">
                        <button
                            id="button-remove-sheet"
                            className="u-full-width"
                            disabled={!this.state.currentSheet}
                            onClick={this.handleRemoveSheetClick.bind(this)}>
                            <i className="fa fa-trash-o fa-fw fa-lg" />
                            { t('home.button.remove') }
                        </button>
                    </div>

                    <div className="four columns">
                        <button
                            id="button-load-sheet"
                            onClick={this.handleLoadSheetClick.bind(this)}
                            className="u-full-width">
                            <i className="fa fa-upload fa-fw fa-lg" />
                            { t('home.button.load') }
                        </button>
                    </div>
                </div>

                <RemoveSheetConfirmationDialog
                    ref="removeSheetConfirmationDialog"
                    onRemoveConfirmed={this.onSheetRemovalConfirmed.bind(this)}
                    currentSheet={this.state.currentSheet}
                />

                <LoadSheetDialog
                    ref="loadSheetDialog"
                    sheets={this.state.sheets}
                    currentSheet={this.state.currentSheet} />

            </section>
        );
    }

}
