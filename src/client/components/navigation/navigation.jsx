import React, {PropTypes} from 'react';
import {t} from 'common/dictionary/dictionary';
import pages from 'client/constants/pages';
import NavigationSelect from 'client/components/navigation/navigationselect.jsx';
import RouterService from 'client/router/routerservice';

/**
 * @class Navigation
 * @description Navigation component for pages
 * @extends {React.Component}
 */
class Navigation extends React.Component {

    render() {
        const {currentPage} = this.props;
        const nextPage = pages[currentPage.next];
        const prevPage = pages[currentPage.prev];
        let prevLink = '';
        let nextLink = '';

        if (prevPage) {
            prevLink =
                <button onClick={RouterService.prev} className="u-full-width">
                    <i className="fa fa-angle-double-left"></i>&nbsp;
                    {t (prevPage.label) }
                </button>;
        }

        if (nextPage) {
            nextLink =
                <button onClick={RouterService.next} className="u-full-width">
                    { t(nextPage.label) }&nbsp;
                    <i className="fa fa-angle-double-right"></i>
                </button>;
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
                        <NavigationSelect className="u-full-width" currentPage={currentPage} />
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
