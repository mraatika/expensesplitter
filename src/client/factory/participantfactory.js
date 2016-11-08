import {cid} from 'client/util/utils';

/**
 * Create participant
 * @param  {Object} props
 * @return {Object}
 */
export default function create(props = {}) {
    return {
        id: cid(),
        name: (props.name || '').trim()
    };
}