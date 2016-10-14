import React, {PropTypes} from 'react';
import TrashButton from '../common/trashbutton.jsx';

class Participant extends React.Component {
    render() {
        return (
            <li>
                <div className="list-text-cell">
                    <i className="fa fa-user fa-lg fa-fw" />
                    <span className="participant-list-participant">
                        {this.props.participant.name}
                    </span>
                </div>
                <div className="list-icon-cell text-right">
                    <TrashButton onClick={() => this.props.onRemoveClick(this.props.participant) }/>
                </div>
            </li>
        );
    }
}

Participant.propTypes = {
    participant: PropTypes.object.isRequired,
    onRemoveClick: PropTypes.func.isRequired
};

export default Participant;