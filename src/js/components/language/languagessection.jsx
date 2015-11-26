import React from 'react';
import _ from 'lodash';
import Constants from '../../constants/AppConstants.js';
import ActionCreators from '../../actions/dataactioncreators.js';

export default class Languages extends React.Component {

    constructor(props) {
        super(props);
        this.languages = _.toArray(Constants.Languages);
    }

    _onFlagClick(lang) {
        ActionCreators.setLanguage(lang);
    }

    render() {
        return (
            <div>
                {
                    this.languages.map(lang => {
                        return <span
                            key={lang}
                            className={'flag ' + lang.toLowerCase() }
                            onClick={() => this._onFlagClick(lang)}/>;
                    })
                }
            </div>
        );
    }
}