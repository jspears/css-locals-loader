"use strict";

var flatten = Function.call.bind(Array.prototype.concat, []);

function loadPlugin(plugin, locals, opts) {
    if (typeof plugin == 'function') {
        return plugin(locals, opts);
    }
    if (typeof plugin === 'string') {
        if (/^css-locals-/.test(plugin)) {
            return require('./' + plugin)(locals, opts);
        }
        return loadPlugin(require(plugin), locals, opts);
    }

    if (Array.isArray(plugin)) {
        return localsLoad(plugin, locals, opts);
    }

    if (typeof plugin === 'object') {
        return Object.keys(plugin).map(function (plug) {
            return loadPlugin(plug, locals, plugin[plug]);
        });
    }

    throw new Error("Can not handle this plugin " + plugin);
}

function localsLoad(plugin, locals, opts) {
    if (!plugin) {
        return [];
    }
    if (typeof plugin === 'string') {
        return localsLoad(plugin.split(/,\s*/), locals, opts);
    }
    plugin = Array.isArray(plugin) ? plugin : [];

    return flatten.apply(null, plugin.map(function (plug) {
        return loadPlugin(plug, locals, opts);
    }));

}

module.exports = localsLoad;
