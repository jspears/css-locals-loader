CSS Locals Loader
===
A webpack plugin to extract more local information out of the css, to expose via css modules.

##Installation
```
 $ npm install css-locals-loader
 
```

##Configuration
Need to add css-locals before your css-loader in the webpack config.

```js
//webpack.config.js

"use strict";
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var path = require('path'), join = path.join.bind(path, __dirname);
var config = {
    //optional array of plugins
    cssLocals:[]
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-locals!css?modules&importLoaders=1&localIdentName=[hash:base64:5]_[name]__[local]')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-locals!css?modules&importLoaders=1&localIdentName=[hash:base64:5]_[name]__[local]!less')
            }]

    },
    plugins: [new ExtractTextPlugin('style.css', {allChunks: true})]
};

module.exports = config;


```
##Plugin API
To add your own locals munger the api is

```
//yourplugin.js

module.exports = function yourLocals(locals){
  
   return function(css, result){
    //this gets executed by postcss, see its documentation for more info 
    ...
   }
}


```
##Plugin API Usage
To activate the plugin add it to the cssLocals property on your webpack config.

```js
//webpack.config.js
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    ...
    //optional array of plugins. If defined, you need to add the default plugin back in if your want to use it.
    cssLocals:['your-plugin', 'css-locals-transition']
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-locals!css?modules&importLoaders=1&localIdentName=[hash:base64:5]_[name]__[local]')
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-locals!css?modules&importLoaders=1&localIdentName=[hash:base64:5]_[name]__[local]!less')
            }]

    },
    plugins: [new ExtractTextPlugin('style.css', {allChunks: true})]

}
```