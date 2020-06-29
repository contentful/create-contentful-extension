import React from 'react';
import { render } from 'react-dom';

import {
  AppExtensionSDK,
  BaseExtensionSDK,
  FieldExtensionSDK,
  init,
  locations
} from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

import Config from './ConfigScreen';
import Entry from './Entry';

interface AppInstallationParameters {
  defaultValue: string;
}

interface ConfigProps {
  sdk: AppExtensionSDK;
}

interface ConfigState {
  parameters: AppInstallationParameters;
}

init((sdk: BaseExtensionSDK) => {
  const root = document.getElementById('root');

  // Select a component depending on a location in which the app is rendered.
  if (sdk.location.is(locations.LOCATION_APP_CONFIG)) {
    // Render the component, passing the SDK down.
    render(<Config sdk={sdk as AppExtensionSDK} />, root);
  } else if (sdk.location.is(locations.LOCATION_ENTRY_FIELD)) {
    // Depending on the location the SDK will have different methods
    render(<Entry sdk={sdk as FieldExtensionSDK} />, root);
  }
});
