import {connect} from 'react-redux';
import TransactionsPage from 'components/transactions/transactionspage.jsx';

function mapStateToProps(state) {
    const {sheet} = state.sheet;
    return { sheet, settings: state.settings };
}

export default connect(mapStateToProps)(TransactionsPage);