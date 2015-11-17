'use strict';

import {cid} from '../util/utils';

const _defaults = Object.freeze({
    name: '',
    price: null,
    participants: [],
    payer: null
});

var ExpenseFactory = {

    create: function(props) {
        var expense = {
            id: cid(),
            name: props.name || _defaults.name,
            price: props.price || _defaults.price,
            participants: props.participants || _defaults.participants,
            payer: props.payer || _defaults.payer
        };

        return expense;
    }
};

export default ExpenseFactory;