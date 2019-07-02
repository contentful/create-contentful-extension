import React from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import {
  DisplayText,
  Paragraph,
  SectionHeading,
  TextInput,
  Textarea,
  FieldGroup,
  RadioButtonField,
  Form
} from '@contentful/forma-36-react-components';
import { init, locations } from 'contentful-ui-extensions-sdk';
import '@contentful/forma-36-react-components/dist/styles.css';
import '@contentful/forma-36-fcss/dist/styles.css';
import './index.css';

/**
 * To use this demo create a Content Type with the following fields:
 *  title: Short text
 *  body: Long text
 *  hasAbstract: Boolean
 *  abstract: Long text
 *
 *  See https://github.com/contentful/create-contentful-extension/blob/master/docs/examples/entry-editor-content-model.json for details.
 */

export class App extends React.Component {
  static propTypes = {
    sdk: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      title: props.sdk.entry.fields.title.getValue(),
      body: props.sdk.entry.fields.body.getValue(),
      abstract: props.sdk.entry.fields.abstract.getValue(),
      hasAbstract: props.sdk.entry.fields.hasAbstract.getValue() || false
    };
  }

  onTitleChangeHandler = event => {
    const value = event.target.value;
    this.setState({ title: value });
    this.props.sdk.entry.fields.title.setValue(value);
  };

  onBodyChangeHandler = event => {
    const value = event.target.value;
    this.setState({ body: value });
    this.props.sdk.entry.fields.body.setValue(value);
  };

  onAbstractChangeHandler = event => {
    const value = event.target.value;
    this.setState({ abstract: value });
    this.props.sdk.entry.fields.abstract.setValue(value);
  };

  onHasAbstractChangeHandler = event => {
    const hasAbstract = event.target.value === 'yes';
    this.setState({ hasAbstract });
    this.props.sdk.entry.fields.hasAbstract.setValue(hasAbstract);
  };

  render() {
    return (
      <Form className="f36-margin--l">
        <DisplayText>Entry extension demo</DisplayText>
        <Paragraph>
          This demo uses a single UI Extension to render the whole editor for an entry.
        </Paragraph>
        <SectionHeading>Title</SectionHeading>
        <TextInput
          testId="field-title"
          onChange={this.onTitleChangeHandler}
          value={this.state.title}
        />
        <SectionHeading>Body</SectionHeading>
        <Textarea testId="field-body" onChange={this.onBodyChangeHandler} value={this.state.body} />
        <SectionHeading>Has abstract?</SectionHeading>
        <FieldGroup row={false}>
          <RadioButtonField
            labelText="Yes"
            checked={this.state.hasAbstract === true}
            value="yes"
            onChange={this.onHasAbstractChangeHandler}
            name="abstractOption"
            id="yesCheckbox"
          />
          <RadioButtonField
            labelText="No"
            checked={this.state.hasAbstract === false}
            value="no"
            onChange={this.onHasAbstractChangeHandler}
            name="abstractOption"
            id="noCheckbox"
          />
        </FieldGroup>
        {this.state.hasAbstract && (
          <React.Fragment>
            <SectionHeading>Abstract</SectionHeading>
            <Textarea
              testId="field-abstract"
              onChange={this.onAbstractChangeHandler}
              value={this.state.abstract}
            />
          </React.Fragment>
        )}
      </Form>
    );
  }
}

init(sdk => {
  if (sdk.location.is(locations.LOCATION_ENTRY_EDITOR)) {
    render(<App sdk={sdk} />, document.getElementById('root'));
  }
});

/**
 * By default, iframe of the extension is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
