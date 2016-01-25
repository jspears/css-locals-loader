"use strict";

var list = require('postcss').list;

function isDimension(prop) {
    return /(?:(max|min)-)?(height|width)/.test(prop);
}
function camel(prop) {
    return prop.replace(/-([\w])/g, function (match, r) {
        return r.toUpperCase();
    });
}
module.exports = function (locals) {

    var classMap = ['enter', 'appear', 'leave'].reduce(function (ret, key) {
        if (key in locals) {
            ret[locals[key]] = key;
        }
        if (key + 'Active' in locals) {
            ret[locals[key + 'Active']] = key;
        }
        return ret;
    }, {});

    var re = new RegExp(Object.keys(classMap).join('|'));


    return function extractDimensions$return(css, result) {
        css.walkRules(re, function (s) {
            var selectorName = s.selector.replace(/^\./, '');
            var prop = classMap[selectorName];

            function updateAutoProperty(c, decl, decend) {
                var heightKey = '@' + camel(prop + '-' + decl);
                var found = false;
                c.walkDecls(decl, function (h) {
                    if (h.value === 'auto') {
                        found = locals[heightKey] = true;
                    }
                });
                if (!decend && !found) {
                    css.walkRules('.' + locals[prop + 'Active'], function (r) {
                        found = updateAutoProperty(r, decl, true)
                    });
                }
                return found;
            }

            s.walkDecls('transition', function (t) {
                list.comma(t.value).forEach(function (v) {
                    var parts = list.space(v);
                    if (isDimension(parts[0])) {
                        updateAutoProperty(s, parts[0])
                    }
                });
            });

            s.walkDecls('transition-property', function (t) {
                list.comma(t.value).forEach(function (v) {
                    if (isDimension(v)) {
                        updateAutoProperty(s, v)
                    }
                });
            });
        });
    };
};