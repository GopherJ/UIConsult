const path = require('path');

const config = module.exports = {
    plugins: []
};

// Set context to the root of the project
config.context = path.resolve(__dirname, '..');

// Entry
config.entry = {
    index: path.resolve(__dirname, 'src/main')
};

// Target
config.target = 'node';

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
