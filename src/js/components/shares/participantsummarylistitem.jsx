import React from 'react';
import {Panel} from 'react-bootstrap';
import ParticipantSummaryListItemHeader from './participantsummarylistitemheader.jsx';
import {ExpenseList} from '../expenses/expenselist.jsx';

/**
 * @class ParticipantSummaryListItem
 * @description Participant's summary list's single item (panel)
 * @extends {ReactComponent}
 */
export default class ParticipantSummaryListItem extends React.Component {

    /**
     * @constructor
     * @param  {object} props
     * @return {ParticipantSummaryListItem}
     */
    constructor(props) {
        super(props);
        this.state = { isExpanded: false };
    }

    /**
     * Toggle collapsible panel
     * @private
     * @return {undefined}
     */
    _onExpand() {
        this.setState({ isExpanded: !this.state.isExpanded });
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const header = <ParticipantSummaryListItemHeader
            headerText={this.props.participant.name}
            isExpanded={this.state.isExpanded}
            onExpand={this._onExpand.bind(this)} />;

        return (
            <Panel collapsible expanded={this.state.isExpanded} header={header}>
                <ExpenseList
                    expenses={this.props.expenses}
                    participants={this.props.participants}
                    isRemoveAllowed={false}/>
            </Panel>
        );
    }
}