import React from 'react';
import Entry from './Entry';
import { configure, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createFakeFieldAPI, createFakeLocalesAPI } from '@contentful/field-editor-test-utils';

configure({
  testIdAttribute: 'data-test-id'
});

const identity = x => x;

describe('Entry component', () => {
  it('Allows user to replace field value with default from app parameters', () => {
    const [field] = createFakeFieldAPI(identity, 'initial value');

    const mockSdk: any = {
      field,
      locales: createFakeLocalesAPI(),
      parameters: {
        installation: {
          defaultValue: 'new default value'
        },
        instance: {}
      }
    };
    render(<Entry sdk={mockSdk} />);
    const button = screen.getByRole('button', { name: /new default value/ });

    expect(screen.getByTestId('cf-ui-text-input')).toHaveValue('initial value');

    userEvent.click(button);

    expect(screen.getByTestId('cf-ui-text-input')).toHaveValue('new default value');
  });
});
