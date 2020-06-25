import React, { Fragment } from 'react';
import spinner from './spinner.gif';

const Spinner = () => (
  <Fragment>
    <img
      src={spinner}
      style={{ width: '200px', margin: 'auto', display: 'block' }}
      alt='Loading....'
    />
  </Fragment>
);
// or if we use a export const Spinner, take the function where we import with {}
export default Spinner;
