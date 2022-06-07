const path = require("path");
const webpack = require("webpack");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const dotenv = require("dotenv");

module.exports = () => {
  dotenv.config();

  return {
    name: "Pixiviewer-app",
    mode: "development",
    devtool: "inline-source-map",
    resolve: {
      extensions: [".js", ".jsx"],
    },
    entry: {
      index: "./src/index",
      background: "./src/background",
      contentScript: "./src/contentScript",
    },
    module: {
      rules: [{
        test: /\.(js|jsx)?$/,
        loader: "babel-loader",
        options: {
          presets: [
            ["@babel/preset-env", {
              targets: {browsers: ["last 2 versions", ">= 5% in KR"]},
              debug: true,
            }],
            "@babel/preset-react",
          ],
          plugins: [
            "react-refresh/babel",
            "@babel/plugin-transform-runtime",
          ],
        },
        exclude: path.join(__dirname, "node_modules"),
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      }],
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/index.html",
      }),
      new ReactRefreshWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          { from: "public" },
        ],
      }),
      new MiniCssExtractPlugin({ filename: `[name].css` }),
      new webpack.DefinePlugin({
        "process.env": JSON.stringify(process.env),
        ENV_CLIENT_ID: JSON.stringify(process.env.CLIENT_ID),
        ENV_CLIENT_SECRET: JSON.stringify(process.env.CLIENT_SECRET),
        ENV_SERVER_URL: JSON.stringify(process.env.SERVER_URL),
        ENV_APP_ID: JSON.stringify(process.env.APP_ID),
      }),
    ],
    output: {
      path: path.join(__dirname, "dist"),
      publicPath: "/",
      filename: "[name].js",
    },
    devServer: {
      historyApiFallback: true,
      port: 4000,
      static: { directory: path.resolve(__dirname) },
      hot: true,
    }
  }
};
