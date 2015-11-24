import React from 'react';
import {Panel} from 'react-bootstrap';
import CollapsiblePanelHeader from '../common/collapsiblepanelheader.jsx';
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
     * Return header for the panel
     * @private
     * @return {ReactComponent}
     */
    _getHeader() {
        return <CollapsiblePanelHeader
            headerText={this.props.participantName}
            isExpanded={this.state.isExpanded}
            onExpand={this._onExpand.bind(this)} />;
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        return (
            <Panel collapsible expanded={this.state.isExpanded} header={this._getHeader()}>
                <ExpenseList
                    expenses={this.props.expenses}
                    participants={this.props.participants}
                    isRemoveAllowed={false}
                    settings={this.props.settings}/>
            </Panel>
        );
    }
}