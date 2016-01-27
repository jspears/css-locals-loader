"use strict";
var tp = require('./utils');
var DEF_SELECTORS = ['enter', 'leave', 'appear', 'enterActive', 'leaveActive', 'appearActive'];
var transition = require('./transition');
var animation  = require('./animation');

module.exports = function cssLocalsTransition(locals, selectors) {

    selectors = selectors || DEF_SELECTORS;

    var selectorsMap = Object.keys(locals).filter(function (key) {
        //only selectors we care about.
        return selectors.indexOf(key) > -1
    }).reduce(function (ret, key) {
        //sets the timeout key.
        ret[locals[key]] = key.replace(/(.+?)(Active)?$/, '@$1Timeout');
        return ret;
    }, {});

    // Work with options here
    var re = new RegExp(Object.keys(selectorsMap).join('|'));

    return function cssLocalsTransition$postCssPlugin(css, result) {
        css.walkRules(re, function (s) {
            var timeoutKey = selectorsMap[s.selector.replace(/^\./, '')];
            var trans = transition(), anim = animation();

            s.walkDecls(/^transition.*/, function (node) {
                trans[node.prop](node.value);
            });

            s.walkDecls(/^animation.*/, function (node) {
                anim[node.prop](node.value)
            });

            var max = Math.max(anim.timeout(), trans.timeout());
            if (max > 0) {
                locals[timeoutKey] = max;
            }
        });

    };
};