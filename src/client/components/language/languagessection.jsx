import React from 'react';
import {toArray} from 'lodash';
import Constants from 'constants/appconstants';

/**
 * @class LanguagesSection
 * @description Change language section
 * @extends {ReactComponent}
 */
export default class LanguagesSection extends React.Component {

    constructor(props) {
        super(props);
        this.languages = toArray(Constants.Languages);
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