import {extend} from 'lodash';
import {cid} from 'util/utils';

const defaults = {
    name: '',
    price: null,
    participants: [],
    payer: null
};

/**
 * Create expense
 * @param  {Object} props
 * @return {Object}
 */
export default function create(props) {
    return extend({}, defaults, {
        id: cid()
    }, props);
}