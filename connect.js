const pkg = require("./package.json");

const path = require("path");
const os = require("os");
const crypto = require("crypto");
const fs = require("fs");

const prompts = require("prompts");
const chalk = require("chalk");
const symbols = require("log-symbols");
const webpack = require("webpack");
const request = require("request-promise-native");

const uuid = () => crypto.randomBytes(20).toString("hex");
const makeEntryPath = entry => path.resolve(process.cwd(), entry);

const CHUNK_SIZE = 29000;

const { argv } = process;

function logError(message, err) {
  console.log(symbols.error, chalk.bold.red(message));
  if (err instanceof Error) {
    console.log(symbols.info, err.message);
    console.log(chalk.dim(err.stack));
  }
  if (typeof err === "string") {
    console.log(symbols.info, err);
  }
}

prepare()
  .then(start)
  .catch(err => {
    logError("Unrecoverable error", err);
    process.exit(1);
  });

async function getEntry() {
  const errMessage =
    "Provide a valid path to a JavaScript file (relative to the current directory)";

  if (argv.length > 2) {
    const entry = makeEntryPath(argv[2]);
    if (isValidEntry(entry)) {
      return entry;
    } else {
      throw new Error(errMessage);
    }
  }

  const { value } = await prompts({
    type: "text",
    name: "value",
    message: "Provide the entry point",
    validate: value => {
      return isValidEntry(value.trim()) ? true : errMessage;
    },
    format: value => makeEntryPath(value.trim())
  });

  return value;
}

function isValidEntry(value) {
  return (
    value.endsWith(".js") &&
    value.length > 3 &&
    fs.existsSync(makeEntryPath(value))
  );
}

async function getConnectionKey() {
  if (argv.length > 3) {
    const connectionKey = parseConnectionKey(argv[3]);
    if (isValidConnectionKey(connectionKey)) {
      return connectionKey;
    } else {
      throw new Error("Invalid connection key");
    }
  }

  const { value } = await prompts({
    type: "text",
    name: "value",
    message: "Provide a connection key",
    validate: value => {
      const errMessage = "Provide a connection key copied from the Web App";
      try {
        const valid = isValidConnectionKey(parseConnectionKey(value));
        return valid ? true : errMessage;
      } catch (err) {
        return errMessage;
      }
    },
    format: value => parseConnectionKey(value)
  });

  return value;
}

function parseConnectionKey(value) {
  const connectionKeyBuf = Buffer.from(value, "base64");
  const connectionKeyString = connectionKeyBuf.toString("utf8");
  return JSON.parse(connectionKeyString);
}

function isValidConnectionKey(connectionKey) {
  const isObject =
    typeof connectionKey === "object" &&
    connectionKey !== null &&
    !Array.isArray(connectionKey);

  return (
    isObject &&
    ["pubKey", "subKey", "channel"].every(prop => {
      return typeof connectionKey[prop] === "string";
    })
  );
}

async function prepare() {
  const data = {
    entry: await getEntry(),
    connectionKey: await getConnectionKey()
  };

  if (!data.entry) {
    throw new Error("Invalid entry provided");
  }
  if (!data.connectionKey) {
    throw new Error("Invalid connection key provided");
  }

  return data;
}

function start({ entry, connectionKey }) {
  const compiler = webpack({
    mode: "development",
    entry,
    output: {
      path: os.tmpdir(),
      filename: `${pkg.name}-bundle-${uuid()}.js`,
      library: "__contentful__uie",
      libraryTarget: "umd"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"]
            }
          }
        }
      ]
    },
    externals: {
      react: "React",
      "react-dom": "ReactDOM"
    }
  });

  const watching = compiler.watch(
    {
      aggregateTimeout: 150,
      ignored: /node_modules/,
      poll: false
    },
    async (err, stats) => {
      if (err) {
        logError("Webpack build error (watch)", err);
      }

      if (stats.hasErrors()) {
        const { errors } = stats.toJson("minimal");
        const err = (errors || [])[0];
        return logError("Webpack build error (stats)", err);
      }

      const { warnings, time, assets, outputPath } = stats.toJson("verbose");

      if (assets.length !== 1) {
        throw new Error(`Expected 1 asset, got ${assets.length}`);
      }

      const [asset] = assets;
      console.log(
        symbols.info,
        `Webpack build ok, ${asset.size} bytes, ${
          warnings.length
        } warnings, took ${time}ms.`
      );

      const bundlePath = path.resolve(outputPath, asset.name);
      const bundleBuf = fs.readFileSync(bundlePath);

      await notify(bundleBuf.toString("utf8"), connectionKey);
    }
  );
}

async function notify(bundle, connectionKey) {
  const chunks = Math.ceil(bundle.length / CHUNK_SIZE);
  const messages = [];
  const messageId = uuid();

  for (let i = 0; i < chunks; i += 1) {
    messages.push({
      mid: messageId,
      i,
      c: chunks,
      b: bundle.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE)
    });
  }

  try {
    await Promise.all(messages.map(msg => send(msg, connectionKey)));
    console.log(
      symbols.success,
      chalk.bold.green(`Notified the Web App about the change`),
      `(${new Date().toLocaleString()})`
    );
  } catch (err) {
    logError("Failed to notify the Web App about the change", err);
  }
}

function send(message, { pubKey, subKey, channel }) {
  return request({
    method: "POST",
    uri: `https://ps.pndsn.com/publish/${pubKey}/${subKey}/0/${channel}/0?store=0`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(message)
  });
}
