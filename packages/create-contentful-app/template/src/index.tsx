import React from 'react';
import { render } from 'react-dom';

import { AppExtensionSDK, BaseExtensionSDK, init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

import Config from './components/ConfigScreen';
import EntryEditor from './components/EntryEditor';
import Page from './components/Page';
import Sidebar from './components/Sidebar';
import Field from './components/Field';
import Dialog from './components/Dialog';

init((sdk: BaseExtensionSDK) => {
  const root = document.getElementById('root');

  // All possible locations for your app
  // Feel free to remove unused locations
  // Dont forget to delete the file too :)
  const ComponentLocationSettings = [
    { location: locations.LOCATION_APP_CONFIG, component: <Config sdk={sdk as AppExtensionSDK} /> },
    {
      location: locations.LOCATION_ENTRY_FIELD,
      component: <Field />
    },
    {
      location: locations.LOCATION_ENTRY_EDITOR,
      component: <EntryEditor />
    },
    { location: locations.LOCATION_DIALOG, component: <Dialog /> },
    {
      location: locations.LOCATION_ENTRY_SIDEBAR,
      component: <Sidebar />
    },
    { location: locations.LOCATION_PAGE, component: <Page /> }
  ];

  // Select a component depending on a location in which the app is rendered.
  ComponentLocationSettings.forEach(componentLocationSetting => {
    if (sdk.location.is(componentLocationSetting.location)) {
      render(componentLocationSetting.component, root);
    }
  });
});
