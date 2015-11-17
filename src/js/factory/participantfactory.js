'use strict';

import {cid} from '../util/utils';

const _defaults = Object.freeze({
    name: ''
});

var ParticipantFactory = {

    create: function(props) {

        var participant = Object.freeze({
            id: cid(),
            name: props.name || _defaults.name
        });

        return participant;
    }
};


export default ParticipantFactory;