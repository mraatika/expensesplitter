import React from 'react';
import {values} from 'ramda';
import Constants from 'client/constants/appconstants';

/**
 * @class LanguagesSection
 * @description Change language section
 * @extends {ReactComponent}
 */
export default class LanguagesSection extends React.Component {

    constructor(props) {
        super(props);
        this.languages = values(Constants.Languages);
    }

    render() {
        return (
            <div>
                {
                    this.languages.map(lang => {
                        return <span
                            key={lang}
                            className={'flag ' + lang.toLowerCase() }
                            onClick={() => this.props.setLanguage(lang)}/>;
                    })
                }
            </div>
        );
    }
}