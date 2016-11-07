/* global document, global */
var jsdom = require('jsdom').jsdom;
var chai = require('chai');
var chaiEnzyme = require('chai-enzyme');
var sinonChai = require('sinon-chai');

global.document = jsdom('');
global.window = document.defaultView;

Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        global[property] = document.defaultView[property];
    }
});

global.navigator = { userAgent: 'node.js' };

chai.use(chaiEnzyme());
chai.use(sinonChai);