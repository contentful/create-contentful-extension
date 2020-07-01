import React from 'react';
import EntryEditor from './EntryEditor';
import { render } from '@testing-library/react';

describe('Entry component', () => {
  it('Matches snapshot', () => {
    const component = render(<EntryEditor />);

    expect(component.container).toMatchSnapshot();
  });
});
