"use strict";

function loadPlugin(plugin, locals, opts) {
    if (typeof plugin === 'string') {
        if (/^css-locals-/.test(plugin)) {
            return require('./' + plugin)(locals, opts);
        }
        return loadPlugin(require(plugin), locals, opts);
    }
    return plugin(locals, opts);
}

function localsLoad(plugin, locals, opts) {
    if (!plugin) {
        return [];
    }
    if (typeof plugin === 'string') {

        return localsLoad(plugin.split(/,\s*/), locals, opts);
    }
    if (!Array.isArray(plugin)) {
        return localsLoad([plugin], locals, opts);
    }

    return plugin.map(function (plug) {
        return loadPlugin(plug, locals, opts);
    });

}

module.exports = localsLoad;
