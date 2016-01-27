"use strict";
var transition = require('./transition');
var utils = require('./utils');
function isDimension(prop) {
    return /(?:(max|min)-)?(height|width)/.test(prop);
}

module.exports = function (locals) {

    var classMap = ['enter', 'enterActive', 'appear', 'appearActive', 'leave', 'leaveActive'].reduce(function (ret, key) {
        if (key in locals) {
            ret[locals[key]] = key;
        }
        return ret;
    }, {});

    var re = new RegExp(Object.keys(classMap).filter(function (v) {
        return !/Active$/.test(v);
    }).join('|'));

    /**
     * Two cases
     *
     * Transition X to auto.
     * .enter {
     *  transition:height 1s ease;
     *  height:0<-- fine.
     * }
     * .enterActive {
     *   height:auto; <-- this triggers height auto
     * }
     * adds
     * \@enterActiveHeight = 'height 1s ease';
     *
     * Transition from auto to X.
     * .enter {
     *  transition:height 1s ease;
     *  height:auto;<-- this triggers height auto
     * }
     * .enterActive {
     *  height:0;
     * }
     * \@enterHeight = 'height 1s ease';
     */
    return function extractDimensions$return(css, result) {
        css.walkRules(re, function (s) {
            var selectorName = s.selector.replace(/^\./, '');
            var prop = classMap[selectorName];
            var trans = transition();
            s.walkDecls(/^transition.*/, function (node) {
                trans[node.prop](node.value);
            });
            trans.property().forEach(function (propname, i) {
                if (!/(?:(max|min)-)?(height|width)/.test(propname)) {
                    return;

                }
                var found = false;

                s.walkDecls(propname, function (node) {
                    if (node.value === 'auto') {
                        //from auto.
                        found = true;
                        locals['@' + utils.camel(prop + '-' + propname)]  = trans.description().join(',');
                    }
                });
                var activeProp = locals[prop + 'Active'];
                if (!found && activeProp)
                    css.walkRules('.'+activeProp, function (activeRule) {
                        activeRule.walkDecls(propname, function (d) {
                            if (d.value === 'auto') {
                                //to auto
                                locals['@' + utils.camel(prop + '-active-' + propname)] = trans.description().join(',');
                            }
                        });
                    });
            });

        });
    };
};