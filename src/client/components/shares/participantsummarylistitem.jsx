import React, {PropTypes} from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import CollapsiblePanelHeader from 'client/components/common/collapsiblepanelheader.jsx';
import ExpenseList from 'client/components/expenses/expenselist.jsx';

/**
 * @class ParticipantSummaryListItem
 * @description Participant's summary list's single item (panel)
 * @extends {ReactComponent}
 */
class ParticipantSummaryListItem extends React.Component {

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
                    currencySymbol={this.props.currencySymbol}/>
            </Panel>
        );
    }
}

ParticipantSummaryListItem.defaultProps = {
    participantName: '',
    currencySymbol: '',
    expenses: [],
    participants: []
};

ParticipantSummaryListItem.propTypes = {
    participantName: PropTypes.string,
    currencySymbol: PropTypes.string,
    expenses: PropTypes.array,
    participants: PropTypes.array
};

export default ParticipantSummaryListItem;