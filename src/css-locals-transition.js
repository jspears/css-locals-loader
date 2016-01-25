"use strict";
var tp = require('./transition-parser');
var DEF_SELECTORS = ['enter', 'leave', 'appear', 'enterActive', 'leaveActive', 'appearActive'];


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
            var timeoutKey = selectorsMap[s.selector.replace(/^\./, '')], delay = null, duration = null, total = locals[timeoutKey] || 0;

            s.walkDecls('transition', function (t) {
                total = Math.max(total, tp.calcMax(t.value))
            });

            s.walkDecls('transition-duration', function (d) {
                duration = d.value
            });

            s.walkDecls('transition-delay', function (d) {
                delay = d.value
            });

            s.walkDecls('animation', function (a) {
                total = Math.max(total, tp.calcMaxAnim(a.value))
            });

            s.walkDecls('animation-delay', function (a) {
                delay = a.value
            });

            s.walkDecls('animation-duration', function (a) {
                duration = a.value
            });


            var max = Math.max(tp.maxLongForm(delay, duration), total);
            if (max > 0) {
                locals[timeoutKey] = max;
            }
        });
    };
};