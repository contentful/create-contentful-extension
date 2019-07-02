/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';
import { EditorExtensionSDK } from 'contentful-ui-extensions-sdk';
import { App } from './index';
import { render, cleanup, fireEvent, configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-test-id'
});

function renderComponent(sdk: EditorExtensionSDK) {
  return render(<App sdk={sdk} />);
}

const sdk: any = {
  entry: {
    fields: {
      title: { getValue: jest.fn(), setValue: jest.fn() },
      body: { getValue: jest.fn(), setValue: jest.fn() },
      abstract: { getValue: jest.fn(), setValue: jest.fn() },
      hasAbstract: { getValue: jest.fn(), setValue: jest.fn() }
    }
  }
};

describe('App', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(cleanup);

  it('should read a values from entry.fields.*', () => {
    sdk.entry.fields.title.getValue.mockReturnValue('title-value');
    sdk.entry.fields.body.getValue.mockReturnValue('body-value');
    sdk.entry.fields.hasAbstract.getValue.mockReturnValue(true);
    sdk.entry.fields.abstract.getValue.mockReturnValue('abstract-value');
    const { getByTestId } = renderComponent(sdk);

    expect((getByTestId('field-title') as HTMLInputElement).value).toEqual('title-value');
    expect((getByTestId('field-body') as HTMLInputElement).value).toEqual('body-value');
    expect((getByTestId('field-abstract') as HTMLInputElement).value).toEqual('abstract-value');

    fireEvent.change(getByTestId('field-body'), {
      target: { value: 'new-body-value' }
    });

    expect(sdk.entry.fields.body.setValue).toHaveBeenCalledWith('new-body-value');
  });
});
