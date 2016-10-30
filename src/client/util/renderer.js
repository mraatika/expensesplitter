import ReactDOM from 'react-dom';

/**
 * Utility functions for rendering views.
 * @type {Object}
 */
var Renderer = {

    /**
     * Render react component to given element
     * @param {ReactComponent} React component to render
     * @param {string} elementId Mount point's css id
     * @return {undefined}
     */
    render(component, elementId) {
        ReactDOM.render(component, document.getElementById(elementId));
    },

    /**
     * Render new content view to the content section
     * @param {ReactComponent} React component to render
     * @return {undefined}
     */
    renderContentView(component) {
        Renderer.render(component, 'content');
    }
};

export default Renderer;