const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = module.exports = {
    plugins: []
};

// Set context to the root of the project
config.context = path.resolve(__dirname, '..');

// Entry
config.entry = {
    index: path.resolve(__dirname, 'src/index.js')
};

// Target
config.target = 'node';

// Externals
config.externals = [nodeExternals()];

// Output
config.output = {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
};

// Resolver
config.resolve = {
    extensions: ['.js']
};


// module
config.module = {
    rules: [
        {
            test: /\.js$/,
            use: 'babel-loader',
            exclude: /node_modules/
        }
    ]
};

if (process.env.NODE_ENV === 'production')
{
    config.optimization = {
        minimizer: [new UglifyJsPlugin({
            parallel: true,
            extractComments: true
        })]
    };
}
