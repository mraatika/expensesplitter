import {cid} from 'client/util/utils';

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
    // set an id for rendering react lists (need to have unique ids)
    return { ...defaults, ...props, id: cid() };
}