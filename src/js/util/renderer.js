'use strict';

import ReactDom from 'react-dom';

/**
 * Utility functions for rendering views.
 * @type {Object}
 */
var Renderer = {
    /**
     * Render new content view to the content section
     * @param   {Component} React component to render
     */
    renderContentView: function(component) {
        ReactDom.render(component, document.getElementById('content'));
    },

    renderFullView: function(component) {
        ReactDom.render(component, document.body);
    }
};

export default Renderer;