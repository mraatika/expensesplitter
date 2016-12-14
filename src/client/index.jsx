import React from 'react'; // eslint-disable-line no-unused-vars
import renderer from 'client/util/renderer';
import Root from 'client/components/root.jsx';

// import styles
import 'font-awesome-sass-loader';
import 'styles/main.scss';

renderer.render(<Root />, 'main');
