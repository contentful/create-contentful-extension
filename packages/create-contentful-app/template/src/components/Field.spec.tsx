import React from 'react';
import Field from './Field';
import { render } from '@testing-library/react';

describe('Field component', () => {
  it('Matches snapshot', () => {
    const component = render(<Field />);

    expect(component.container).toMatchSnapshot();
  });
});
