import {connect} from 'react-redux';
import TransactionsPage from 'components/transactions/transactionspage.jsx';

export default connect(state => {return {sheet: state.sheet.sheet};})(TransactionsPage);