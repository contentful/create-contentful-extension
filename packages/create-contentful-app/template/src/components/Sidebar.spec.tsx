import React from 'react';
import Sidebar from './Entry';
import { render } from '@testing-library/react';

describe('Sidebar component', () => {
  it('Matches snapshot', () => {
    const component = render(<Sidebar />);

    expect(component.container).toMatchSnapshot();
  });
});
