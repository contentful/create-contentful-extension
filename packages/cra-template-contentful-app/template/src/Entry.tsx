import React from 'react';
import { FieldExtensionSDK } from 'contentful-ui-extensions-sdk';
import { SingleLineEditor } from '@contentful/field-editor-single-line';

import { Button } from '@contentful/forma-36-react-components';
import { AppInstallationParameters } from './ConfigScreen';

const Entry = ({ sdk }: { sdk: FieldExtensionSDK }) => {
  const installation = sdk.parameters.installation as AppInstallationParameters;

  return (
    <div>
      <Button onClick={() => sdk.field.setValue(installation.defaultValue)}>
        Click to set to default value of {installation.defaultValue}
      </Button>
      <SingleLineEditor locales={sdk.locales} field={sdk.field} />
    </div>
  );
};

export default Entry;
