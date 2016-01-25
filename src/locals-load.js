"use strict";

function loadPlugin(plugin) {
    if (typeof plugin === 'string') {
        if (plugin === 'css-locals-transition') {
            return require('./css-locals-transition')(this);
        }
        return loadPlugin.call(this, require.main.require(plugin));
    }
    return plugin(this);
}

function localsLoad(plugin, locals) {
    if (!plugin) {
        return [];
    }
    if (typeof plugin === 'string') {

        return localsLoad(plugin.split(/,\s*/), locals);
    }
    if (!Array.isArray(plugin)) {
        return localsLoad([plugin], locals);
    }

    return plugin.map(loadPlugin, locals);

}

module.exports = localsLoad;
