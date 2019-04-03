import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Button } from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import tokens from '@contentful/forma-36-tokens';
import '@contentful/forma-36-react-components/dist/styles.css';
import './index.css';
import extension from '../extension.json';

class DialogExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  render() {
    return (
      <div style={{ margin: tokens.spacingM }}>
        <Button
          buttonType="muted"
          onClick={() => {
            this.props.sdk.close('data from modal dialog');
          }}
        >
          Close modal
        </Button>
      </div>
    );
  }
}

class SidebarExtension extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.props.sdk.window.startAutoResizer();
  }

  onButtonClick = async () => {
    const result = await this.props.sdk.dialogs.openExtension({
      id: extension.id,
      width: 800,
      title: 'The same extension rendered in modal window',
    });
    console.log(result);
  };

  render() {
    return (
      <Button
        buttonType="positive"
        isFullWidth={true}
        onClick={this.onButtonClick}
      >
        Click on me to open dialog extension
      </Button>
    );
  }
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_DIALOG)) {
    ReactDOM.render(
      <DialogExtension sdk={sdk} />,
      document.getElementById('root')
    );
  } else {
    ReactDOM.render(
      <SidebarExtension sdk={sdk} />,
      document.getElementById('root')
    );
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
