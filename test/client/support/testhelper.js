import React from 'react';
import {mount, shallow} from 'enzyme';

/**
 * Renderer to shallow render a React component via enzyme
 * @param  {Component} component
 * @param  {Object} defaultProps
 * @return {Function}
 */
export function componentRenderer(component, defaultProps) {
    /**
     * Shallow render a component
     * @param  {Object} props
     * @return {ShallowWrapper}
     */
    return function renderComponent(props) {
        return shallow(React.createElement(component, { ...defaultProps, ...props }));
    };
}

/**
 * Renderer to fully render a React component via enzyme
 * @param  {Component} component
 * @param  {Object} defaultProps
 * @return {Function}
 */
export function componentMounter(component, defaultProps) {
    /**
     * Render a component
     * @param  {Object} props
     * @return {ReactWrapper}
     */
    return function mountComponent(props) {
        return mount(React.createElement(component, { ...defaultProps, ...props }));
    };
}