import {cid} from '../util/utils';

/**
 * Create participant
 * @param  {Object} props
 * @return {Object}
 */
export default function create(props) {
    return {
        id: cid(),
        name: props.name || ''
    };
}