const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry : ['babel-polyfill','./src/js/index.js'],
    output : {
        path : path.resolve(__dirname,'dist'), 
    /* //for this use a built-in node package path.resolve() is a method in path package 1st argument : __dirname current absolute path and 2nd arg: our bundle.js is in dist/js
        path revolve to now join this current path so that the working-
        -directory, the Forkify directory, with the one that we want our bundle to be in,which is dist.
     this path resolve, which is a method which is available to us through this path package that we included up here on this line, 
     we will then join the current absolute path with the one that we want
      our bundle to be in. So dist/js. So basically this folder here. And so now webpack will 
      output our file to this directory with this bundle.js file name. 
      "start" is the std name for js that is running in the background 
    and that should open in the browser - for auto reload of the browser page */
        filename : 'js/bundle.js'
    },
    //mode : 'development'//production and the development mode.
    devServer : {

        contentBase : './dist' // from where webpack should serve our files here from dist folder src folder is for our dev purposes
    },
    plugins: [ //an array of all plugins
        new htmlWebpackPlugin({ //always pass options in an object and plugins is to automatically include script tag from one html to another html
            filename: "index.html",
            template: "./src/index.html"
        })
    ],
    /* All the loaders have to be included in an array and test property is where regular expressions are used
    There are certain things that can't be simply converted from ES6 to ES5 like promises so these must 
    be written in ES5 so that implementations of promises can be done in ES5*/
    module: {
        rules: [
            {
                test:  /\.js$/,
                exclude: /\node_modules/,
                use: {
                    loader: 'babel-loader'
                }

            }
        ]
    }
};