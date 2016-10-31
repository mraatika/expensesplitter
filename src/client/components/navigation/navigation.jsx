import React, {PropTypes} from 'react';
import {Link} from 'react-router';
import {t} from 'common/dictionary/dictionary';
import pages from '../../constants/pages.js';
import NavigationSelect from './navigationselect.jsx';

/**
 * @class Navigation
 * @description Navigation component for pages
 * @extends {React.Component}
 */
class Navigation extends React.Component {

    render() {
        const {currentPage, sheetId} = this.props;
        const nextPage = pages[currentPage.next];
        const prevPage = pages[currentPage.prev];
        let prevLink = '';
        let nextLink = '';

        if (prevPage) {
            prevLink =
                <Link to={`/sheet/${sheetId}${prevPage.href}`} className="button u-full-width">
                    <i className="fa fa-angle-double-left"></i>&nbsp;
                    {t (prevPage.label) }
                </Link>;
        }

        if (nextPage) {
            nextLink =
                <Link to={`/sheet/${sheetId}${nextPage.href}`} className="button u-full-width">
                    { t(nextPage.label) }&nbsp;
                    <i className="fa fa-angle-double-right"></i>
                </Link>;
        }

        return (
            <nav role="navigation">
                { /* display desktop sized screens only */}
                <div className="row desktop-only">
                    <div className="three columns">
                        { prevLink }
                    </div>
                    <div className="one column">&nbsp;</div>
                    <div className="four columns">
                        <NavigationSelect className="u-full-width" currentPage={currentPage} sheetId={sheetId}/>
                    </div>
                    <div className="one column">&nbsp;</div>
                    <div className="three columns">
                        { nextLink }
                    </div>
                </div>
                { /* display on screens smaller than desktop */}
                <div className="row no-desktop">
                    <div className="six columns">
                        { prevLink }
                    </div>
                    <div className="six columns">
                        { nextLink }
                    </div>
                </div>
            </nav>
        );
    }
}

Navigation.propTypes = {
    currentPage: PropTypes.object.isRequired,
    sheetId: PropTypes.string.isRequired
};

export default Navigation;
