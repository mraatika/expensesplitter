import React from 'react';
import {Link} from 'react-router';
import Swipeable from 'react-swipeable';
import Modal from 'react-bootstrap/lib/Modal';
import NotificationSystem from 'react-notification-system';
import {t, setLanguage} from 'common/dictionary/dictionary';
import LanguagesSection from 'client/components/language/languagessection.jsx';
import RouterService from 'client/router/routerservice';
import {URLUtils} from 'client/util/utils';


/**
 * @class App
 * @description Main component for ExpenseSplitter
 * @extends {ReactComponent}
 */
class App extends React.Component {

    constructor(props) {
        super(props);
        this._promptCloseIfDirty = this._promptCloseIfDirty.bind(this);
    }

    componentWillMount() {
        // sheet id from the router
        const sheetId = this.props.params.sheetId;

        setLanguage(this.props.language);

        // create a dummy sheet even if sheet id is given
        // so there's always a sheet
        this.props.createSheet({});

        if (sheetId) {
            this.props.fetchSheet(sheetId);
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this._promptCloseIfDirty);
    }

    componentWillReceiveProps(nextProps) {
        // check for notifications
        if (nextProps.notifications.length !== this.props.notifications.length) {
            const {notifications} = nextProps;
            this._notificationSystem.addNotification(notifications[notifications.length - 1]);
        }

        const currentSheetId = this.props.params.sheetId;
        const nextSheetId = nextProps.params.sheetId;
        const propId = this.props.sheet.id;

        // change the language used if changed
        if (nextProps.language && nextProps.language !== this.props.language) setLanguage(nextProps.language);

        // replace active sheet with a new sheet when navigated to root url without the id in url params
        if (!nextSheetId) {
            if (currentSheetId)  this.props.createSheet({});
            return;
        }

        // fetch sheet from the server if navigated from the root url to url with sheet id in url params
        if (!currentSheetId) {
            // do not fetch if already fetched but the url hasn't yet changed
            if (nextSheetId !== propId) this.props.fetchSheet(nextSheetId);
            return;
        }

        // fetch sheet from the server when the sheet id in url params is changed from sheet id to sheet id
        if (nextSheetId !== currentSheetId && nextSheetId !== propId) {
            this.props.fetchSheet(nextSheetId);
            return;
        }
    }

    componentWillUnmount() {
        window.removeEventListener('beforeunload', this._promptCloseIfDirty);
    }

    /**
     * Display confirmation before closing if the sheet is not saved
     * @private
     * @param   {Event} e
     * @return  {string}
     */
    _promptCloseIfDirty(e) {
        if (process.env.NODE_ENV == 'production') {
            if (this.props.sheet.dirty) {
                const message = t('app.close_prompt_message');
                e.returnValue = message;
                return message;
            }
        }
    }

    /**
     * @return {ReactComponent}
     */
    render() {
        const {isFetching} = this.props;
        const {sheetId, adminKey} = this.props.params;
        const appName = t('app.name');

        return (
            <Swipeable
                onSwipedRight={() => RouterService.prev()}
                onSwipedLeft={() => RouterService.next()}
                delta={200}>

                <div id="app-wrapper" className="container">
                    <header role="banner">
                        <div className="text-center">
                            <h1>
                                <Link to={URLUtils.formSubpageUrl('/', sheetId, adminKey)}>
                                    <div className="rotation">{ appName[0] }</div>
                                    { appName.substring(1) }
                                </Link>
                            </h1>
                            <br/>
                            <span className="app-slogan bold">{  `- ${ t('app.info')}!`}</span>
                        </div>
                    </header>

                    <Modal show={isFetching}>
                        <Modal.Body>
                            <div className="text-center">
                                <i className="fa fa-spinner fa-3x fa-spin" />&nbsp;
                                <span className="italic">{t('lang.loading')}...</span>
                            </div>
                        </Modal.Body>
                    </Modal>

                    <NotificationSystem ref={ c => this._notificationSystem = c} />

                    <main role="main" id="content">
                        { React.cloneElement(this.props.children) }
                    </main>

                    <footer role="contentinfo" className="text-right">
                        <div className="u-pull-left">
                            <LanguagesSection setLanguage={this.props.setLanguage} />
                        </div>
                        <small className="u-pull-right">{ `${t('app.name')} v${process.env.APP_VERSION}` }</small>
                    </footer>
                </div>
            </Swipeable>
        );
    }
}

export default App;