import React from 'react';
import Page from './Page';
import { render } from '@testing-library/react';

describe('Page component', () => {
  it('Matches snapshot', () => {
    const component = render(<Page />);

    expect(component.container).toMatchSnapshot();
  });
});
