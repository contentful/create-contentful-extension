import * as React from 'react';
import { render } from 'react-dom';
import { Router, Switch, Route, Link } from 'react-router-dom';
import { MemoryHistory, createMemoryHistory } from 'history';
import {
  init,
  locations,
  SidebarExtensionSDK,
  PageExtensionSDK
} from 'contentful-ui-extensions-sdk';
import { Tab, Tabs, TabPanel, Heading, Button } from '@contentful/forma-36-react-components';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

function MainPage() {
  return (
    <TabPanel id="main" className="f36-margin-top--l">
      Main page
    </TabPanel>
  );
}

function OtherPage() {
  return (
    <TabPanel id="other" className="f36-margin-top--l">
      <div>Other page</div>
      <Link to="/">Go back to main tab</Link>
    </TabPanel>
  );
}

function Page404() {
  return <Heading>404</Heading>;
}

interface PageExtensionProps {
  sdk: PageExtensionSDK;
}

interface InvocationParams {
  path: string;
}

export class PageExtension extends React.Component<PageExtensionProps> {
  history: MemoryHistory;

  constructor(props: PageExtensionProps) {
    super(props);

    const invocationParams = props.sdk.parameters.invocation as InvocationParams;

    this.history = createMemoryHistory({
      initialEntries: [invocationParams.path]
    });

    this.history.listen(location => {
      this.props.sdk.navigator.openPageExtension({ path: location.pathname });
    });
  }

  render() {
    return (
      <div className="f36-margin--l">
        <Router history={this.history}>
          <Tabs>
            <Route
              render={props => (
                <>
                  <Tab
                    id="main"
                    selected={props.location.pathname === '/'}
                    onSelect={() => {
                      props.history.push('/');
                    }}>
                    Main
                  </Tab>
                  <Tab
                    id="other"
                    selected={props.location.pathname === '/other'}
                    onSelect={() => {
                      props.history.push('/other');
                    }}>
                    Other
                  </Tab>
                </>
              )}
            />
          </Tabs>
          <Switch>
            <Route path="/" exact render={MainPage} />
            <Route path="/other" exact render={OtherPage} />
            <Route render={Page404} />
          </Switch>
        </Router>
      </div>
    );
  };
}

export function SidebarExtension(props: { sdk: SidebarExtensionSDK }) {
  React.useEffect(() => {
    return props.sdk.window.startAutoResizer();
  }, [props.sdk]);

  return (
    <Button
      testId="open-page-extension"
      onClick={() => {
        props.sdk.navigator.openPageExtension({ path: '/' });
      }}>
      Open page extension
    </Button>
  );
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_PAGE)) {
    render(<PageExtension sdk={sdk as PageExtensionSDK} />, document.getElementById('root'));
  } else if (sdk.location.is(locations.LOCATION_ENTRY_SIDEBAR)) {
    render(<SidebarExtension sdk={sdk as SidebarExtensionSDK} />, document.getElementById('root'));
  } else {
    return null;
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
