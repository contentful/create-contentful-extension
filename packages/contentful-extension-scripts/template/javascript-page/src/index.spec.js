import React from 'react';
import { render, fireEvent, cleanup, configure } from '@testing-library/react';
import { SidebarExtension } from './index';

configure({
  testIdAttribute: 'data-test-id'
});

describe('SidebarExtension', () => {
  afterEach(cleanup);

  it('render button', () => {
    const sdk = {
      window: {
        startAutoResizer: jest.fn()
      },
      navigator: {
        openPageExtension: jest.fn()
      }
    };
    const { getByTestId } = render(<SidebarExtension sdk={sdk} />);

    expect(sdk.window.startAutoResizer).toHaveBeenCalled();

    fireEvent.click(getByTestId('open-page-extension'));

    expect(sdk.navigator.openPageExtension).toHaveBeenCalledWith({
      path: '/'
    });
  });
});
