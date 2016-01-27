"use strict";

var list = require('postcss').list;
var utils = require('./utils');

/**
 * An object|object factory that returns
 * a transition object.   Meant to be called in the
 * order that the properties in css are exposed to
 * accurately calculate timeouts and expressions.
 *
 * @param trans
 * @returns {Transition}
 * @constructor
 */
function Transition(trans) {
    if (!(this instanceof Transition)) {
        return new Transition(trans);
    }
    //holds the settings.
    var property = [];
    var duration = [];
    var delay = [];
    var timingFunction = [];

    this.description = function description(filter) {
        return property.filter(utils.filter(filter)).map(function (prop, i) {

            var def = [
                prop,
                utils.repeatAt(i, duration, 0)
            ];

            var tf = utils.repeatAt(i, timingFunction);

            if (tf) {
                def.push(tf);
            }

            var d = utils.repeatAt(i, delay);
            if (d != null && d != 0) {
                def.push(d);
            }
            return def.join(' ');
        });
    };

    this.timeout = function _timeout(filter) {
        var iter = filter ? property.filter(utils.filter(filter)) : delay.length > duration.length ? delay : duration;
        return iter.length === 0 ? 0 : utils.max(iter.map(function timeout$map(prop, i) {
            return utils.repeatAt(i, duration, 0) + utils.repeatAt(i, delay, 0);
        }))
    };

    this.toString = function () {
        return `transition: ${this.description().join(', ')}`;
    };


    this.transition = function _addTransition(transition) {
        //is this correct, chrome resets on transition delcaration.
        //reset
        duration.length = delay.length = timingFunction.length = property.length = 0;
        /*
         transition: opacity 1s ease 2s, height
         ----
         transition-delay 2s, 0s
         transition-duration 1s, 0s
         transition-property opacity, height
         transition-timing-function ease, ease
         */
        list.comma(transition).forEach(function (c) {
            var parts = list.space(c);
            if (parts.length === 0) return;
            utils.addAtEnd(property, parts.shift());

            if (parts[0]) {
                duration.push(utils.toMillis(parts.shift()));
                if (!parts[0]) {
                    delay.push(0);
                    timingFunction.push(Transition.defaultTimingFunction)
                }
            } else {
                duration.push(0);
                delay.push(0);
                timingFunction.push(Transition.defaultTimingFunction)
            }
            if (utils.isTiming(parts[0])) {
                timingFunction.push(Transition.defaultTimingFunction);
                delay.push(utils.toMillis(parts.shift()));
            } else if (parts[0]) {
                timingFunction.push(parts.shift());
                delay.push(parts[0] ? utils.toMillis(parts.shift()) : 0);
            }

        });
        return this;
    };

    this['transition-property'] = this.property = function _property(props) {
        if (arguments.length !== 0) {
            list.comma(props).forEach(utils.addAtEnd.bind(utils, property));
            return this;
        }
        return property.concat();
    };

    this['transition-timing-function'] = this.timingFunction = function _timingFunction(tfs) {
        if (arguments.length !== 0) {
            utils.replace(timingFunction, list.comma(tfs));
            return this;
        }
        return timingFunction.concat();
    };

    this['transition-delay'] = this.delay = function _delay(delays) {
        if (arguments.length !== 0) {
            utils.replaceMillis(delay, delays);
            return this;
        }
        return delay.concat();
    };

    this['transition-duration'] = this.duration = function _duration(durations) {
        if (arguments.length !== 0) {
            utils.replaceMillis(duration, durations);
            return this;
        }
        return delay.concat();
    };


    if (trans) {
        this.transition(trans);
    }
}
Transition.defaultTimingFunction = 'ease';

module.exports = Transition;