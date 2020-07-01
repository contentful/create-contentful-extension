import React from 'react';
import Dialog from './Dialog';
import { render } from '@testing-library/react';

describe('Dialog component', () => {
  it('Matches snapshot', () => {
    const component = render(<Dialog />);

    expect(component.container).toMatchSnapshot();
  });
});
