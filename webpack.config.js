const path = require("path");
const { VueLoaderPlugin } = require('vue-loader')
const CopyPlugin = require('copy-webpack-plugin');
const WebpackCleanPlugin = require('webpack-clean');

const TerserJSPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const build = {
    mode: "development"
    // mode: "production"
}

const vueJScompilation = {
    entry: path.resolve(__dirname, "ui-src/js/app.js"),
    mode: build.mode,
    output: {
        path: path.resolve(__dirname, "ui-dist/js"),
        filename: "app.bundle.js"
    },
    module: {
        rules: [{
            test: /\.vue$/,
            use: 'vue-loader'
        }]
    },
    plugins: [
        new VueLoaderPlugin()
    ],
    resolve: {
        alias: {
            "vue$": "vue/dist/vue.common.js"
        }
    }
};

const copyFiles = {
    context: path.join(__dirname, './'),
    mode: "development",
    plugins: [
        new CopyPlugin([
            // fonts
            {
                from: path.resolve(__dirname, 'ui-src/fonts/**/*'),
                to: path.resolve(__dirname, 'ui-dist/_fonts'),
                context: path.resolve(__dirname, "ui-src/fonts")
            },
        ])
    ]
}

const cleanFiles = {
    mode: "development",
    plugins: [
        new WebpackCleanPlugin([
            path.resolve(__dirname, '/ui-dist/**/*')
        ])
    ]
};

const scssCompilation = {
    entry: path.resolve(__dirname, "ui-src/scss/index.scss"),
    output: {
        path: path.resolve(__dirname, "ui-dist/_css")
    },
    mode: build.mode,
    module: {
        rules: [{
            test: /\.scss$/,
            use: [
                { loader: MiniCssExtractPlugin.loader, options: { sourceMap: true } },
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]

        }]
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    plugins: [
        ///...
        new MiniCssExtractPlugin({
            filename: "index.css"
        }),
        new WebpackCleanPlugin([
            path.resolve(__dirname, '/ui-dist/_css/main.js')
        ])
    ]
};


module.exports = [
    cleanFiles, vueJScompilation, copyFiles, scssCompilation
];

