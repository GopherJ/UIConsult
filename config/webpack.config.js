const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const config = module.exports = {
    plugins: []
};

// Set context to the root of the project
config.context = path.resolve(__dirname, '../');

// Entry
config.entry = {
    index: path.join(config.context, 'src/index.js')
};

// Target
config.target = 'node';

// Externals
config.externals = [nodeExternals()];

// Output
config.output = {
    path: path.join(config.context, 'dist')
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
    config.output.filename = '[name].min.js';
    config.mode = 'production';
    config.optimization = {
        minimizer: [new UglifyJsPlugin({
            parallel: true,
            extractComments: true
        })]
    };
} else {
    config.output.filename = '[name].js';
    config.mode = 'development';
    config.devtool = '#source-map';
}
