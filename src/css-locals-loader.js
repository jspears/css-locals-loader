"use strict";

var postcss = require('postcss');
var localsLoad = require('./locals-load');

module.exports = function (source, map) {
    if (this.cacheable) {
        this.cacheable();
    }

    var cssLocalPlugins = this.options && this.options.cssLocals && this.options.cssLocals.length
        ? this.options.cssLocals : [require('./css-locals-transition')];
    var lines = source.split('\n');

    var css = "";

    var exports = {
        push(id){
            css = id[1];
        },
        locals: {}
    };

    var callback = this.async();

    //yeah, I know should use child compiler, but damn that is a lot of work.
    (new Function(['exports', 'module'], lines.slice(1).join('\n'))(exports, {}));

    postcss(localsLoad(cssLocalPlugins, exports.locals)).process(css, {}).then(function () {

        var str = lines.slice(0, lines.indexOf('// exports')).join('\n');
        str += '// exports\nexports.locals = ' + JSON.stringify((exports.locals), null, 2) + ';';
        callback(null, str);
    }).catch(callback);
};