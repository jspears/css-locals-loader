"use strict";

var max = Function.apply.bind(Math.max, Math);
var list = require('postcss').list;
var api = {
    /**
     * Basically Math.max, but it accepts an array of numbers.
     */
    max: max,
    maxLongForm(duration, delay){
        duration = api.toProperties(duration);
        delay = api.toProperties(delay);

        var calc = [];
        for (var i = 0, l = Math.max(duration.length, delay.length); i < l; i++) {
            calc.push(api.toMillis(duration[i]) + api.toMillis(delay[i]));
        }

        return max(calc);
    },
    maxLongFormArr(duration, delay){
        duration = api.toProperties(duration);
        delay = api.toProperties(delay);

        var calc = [];
        for (var i = 0, l = Math.max(duration.length, delay.length); i < l; i++) {
            calc.push(api.toMillis(duration[i]) + api.toMillis(delay[i]));
        }

        return max(calc);
    },

    /**
     * Converts a multi-property transition expression into an array of tranistion expressions
     * @param {string} val -transition css property;
     */
    toProperties(val){
        return val == null ? [] : list.comma(val);
    },
    /**
     * Given a transition expression it finds the value of maximum delay + duration in miliseconds.
     * @param {string} single css properties.
     * @returns {number}
     */
    calcMax(val){
        return max(api.toProperties(val).map(api.calcDelay));
    },
    /**
     * Given a single css transition property it returns teh delay + duration.
     *
     * @param val
     * @returns {*}
     */
    calcDelay(val){
        if (!val) return 0;
        var parts = list.space(val);
        parts.shift(1);
        var dur = api.toMillis(parts[0]);
        var delay = 0;
        if (parts[1] && /^((\d*?(?:(\.\d+?))?)(?:(ms|s))?)$/.test(parts[1])) {
            delay = api.toMillis(parts[1]);
        } else if (parts[2] && /^((\d*?(?:(\.\d+?))?)(?:(ms|s))?)$/.test(parts[2])) {
            delay = api.toMillis(parts[2]);
        }
        return dur + delay;
    },
    /**
     * Given a single css transition property it returns teh delay + duration.
     *
     * @param val
     * @returns {*}
     */
    calcMaxAnim(val){
        return max(api.toProperties(val).map(api.calcAnimDelay));
    },
    calcAnimDelay(val){
        if (!val) return 0;
        var parts = list.space(val);
        var dur = api.toMillis(parts[0]);
        var delay = 0;
        if (parts[2] && /^((\d*?(?:(\.\d+?))?)(?:(ms|s))?)$/.test(parts[2])) {
            delay = api.toMillis(parts[2]);
        }
        return dur + delay;

    },
    /**
     * Takes a duration/delay timing string and returns the value in milliseconds.
     * @param {string} val - Duration timing string, EX. 100, 100s, 1000ms, 1.2s
     * @returns {number}
     */
    toMillis(val){
        if (val == null) {
            return 0;
        }
        var parts = /(\d*(\.\d+?)?)(ms|s)?/.exec('' + val);

        if (!parts) return 0;
        if (!parts[1]) return 0;
        var v = parseFloat(parts[1]);
        switch (parts[3]) {
            case 's':
                return v * 1000;
            default:
                return v;
        }
    }

};

module.exports = api;