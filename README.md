# Create Contentful Extension [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-green.svg)](https://github.com/contentful/create-contentful-extension/pulls)

Create Contentful Extension is a CLI tool for developing in-app extensions without the hassle of managing build configurations.

If something doesn’t work, please [file an issue](https://github.com/contentful/create-contentful-extension/issues/new).

## Quick Overview

```sh
npx @contentful/create-contentful-extension my-first-extension
cd my-first-extension && npm install
npm run login && npm run start
```

### Requirements

- Node 8 or higher
- NPM 5.2 and higher

### Get Started Immediately

You **don’t** need to install or configure tools like Webpack or Babel.<br>
They are preconfigured and hidden so that you can focus on the code.

We use [Parcel](https://parceljs.org) bundler under the hood and you can use all assets that are supported there with no additional configuration.

## Creating an extension

```
npx @contentful/create-contentful-extension my-first-extension
```

It will ask you what type of extension you want to create ([read about different types of extensions](https://www.contentful.com/developers/docs/extensibility/ui-extensions/)):

<p align='center'>
<img src='./docs/select-type.png' width='600'>
</p>

Then `npm` will install all required development and production dependencies and create a directory called `my-first-extension` inside the current folder.

Inside that directory, it will generate the initial project structure:

```
my-first-extension
├── node_modules
├── .babelrc
├── package.json
├── extension.json
└── src
    ├── index.html
    ├── index.js
    └── index.css
```

Once the installation is done, you can open your project folder:

```sh
cd my-first-extension
```

Inside the newly created project, you can run some built-in commands:

### `npm run start`

Starts the development server and deploys the extension in development mode.

The extension will automatically reload if you make changes to the code.

### `npm run build`

Builds the extension for production to the `build` folder.<br>
It correctly bundles React and all dependencies in production mode and optimizes the build for the best performance.

### `npm run login`

Starts new session with our CLI. As the CLI tool uses our Content Management API, you need to have an CMA access token to use all the commands.

### `npm run logout`

Ends your current session with the CLI tool.

### `npm run deploy`

Bundles the extension for production and deploys bundled version to Contentful.

### `npm run help`

Shows help information about `create-contentful-extension`.

## What’s Included?

Your environment will have everything you need to build a modern Contentful UI Extension with React:

- React, JSX, ES6, TypeScript and all that supported by [Parcel](https://parceljs.org)
- [Forma 36](https://f36.contentful.com/) - React component library for Contentful design system.
- A live development server with hot reload.
- A build script to bundle JS, CSS, and images for production by inlining everything to `srcdoc`
- Hassle-free updates for the above tools with a single dependency.

Despite the fact that we encourage you to use React + Forma36 for building extensions, you can pick any framework and use it as you would use it with Parcel bundler.

## FAQ

#### I use development mode but my extension is not showing up. What's wrong?

In development mode, extension is served from `http://localhost:1234`, but `app.contentful.com` is loaded via `https` protocol which leads to `mixed content` issue. While doing development you need to click **Load unsafe scripts** (Chrome) to enable serving extension from `http://localhost`.

#### I want to serve extension in development mode from custom port number (not default 1234). Is it possible?

Yes, it's possible. Edit `prestart` and `start` scripts in package.json file according to the following example:

```json
"prestart": "contentful space use && contentful extension update --src http://localhost:8000 --force",
"start": "contentful-extension-scripts start --port 8000",
```

#### I don't want to select space every time while using `npm run start` and `npm run deploy` and I want to use different environment. What can I do?

You can replace `contentful space use` command in scripts with concrete `space-id` and `environment-id` values:

```json
"prestart": "contentful extension update --src http://localhost:1234 --space-id <space-id> --environment-id <env-id> --force"
```

## Contributing

We'd love to have your helping hand on `create-contentful-extension`!

## License

Create Contentful Extension is open source software [licensed as MIT](./LICENSE).
