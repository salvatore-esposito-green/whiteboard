import path from "path";
import webpack from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import ForkTsCheckerWebpackPlugin from "fork-ts-checker-webpack-plugin";
import { TsconfigPathsPlugin } from "tsconfig-paths-webpack-plugin";
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevelopment = process.env.PRODUCTION !== "true";

import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as WebpackDevServerConfiguration } from "webpack-dev-server";

interface Configuration extends WebpackConfiguration {
	devServer?: WebpackDevServerConfiguration;
}

const generateScopedName = (localName, resourcePath) => {
	const componentName = resourcePath.split("/").slice(-2, -1);

	return componentName + "_" + localName;
};

const webpackConfig = (env): Configuration => ({
	entry: "./src/index.tsx",
	...(!isDevelopment ? {} : { devtool: "eval-source-map" }),
	resolve: {
		extensions: [".ts", ".tsx", ".js", ".scss"],
		//@ts-ignore
		plugins: [new TsconfigPathsPlugin()],
	},
	output: {
		path: path.join(__dirname, "/dist"),
		filename: "build.js",
	},
	devtool: isDevelopment ? "source-map" : false,
	devServer: {
		allowedHosts: ["all"],
		open: true,
		hot: true,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: "ts-loader",
				options: {
					transpileOnly: true,
				},
				exclude: /dist/,
			},
			{
				test: /\.module\.s(a|c)ss$/,
				use: [
					isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							sourceMap: isDevelopment,
							importLoaders: 1,
							modules: {
								localIdentName: "[name]__[local]___[hash:base64:5]",
							},
						},
					},
					{
						loader: "sass-loader",
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
			{
				test: /\.s(a|c)ss$/,
				exclude: /\.module.(s(a|c)ss)$/,
				use: [
					isDevelopment ? "style-loader" : MiniCssExtractPlugin.loader,
					"css-loader",
					{
						loader: "sass-loader",
						options: {
							sourceMap: isDevelopment,
						},
					},
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/index.html",
		}),
		new webpack.DefinePlugin({
			"process.env.PRODUCTION": env.production || !env.development,
			"process.env.NAME": JSON.stringify(require("./package.json").name),
			"process.env.VERSION": JSON.stringify(require("./package.json").version),
		}),
		new ForkTsCheckerWebpackPlugin(),
		new MiniCssExtractPlugin({
			filename: isDevelopment ? "[name].css" : "[name].[hash].css",
			chunkFilename: isDevelopment ? "[id].css" : "[id].[hash].css",
		}),
	],
});

export default webpackConfig;
