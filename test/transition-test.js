"use strict";
var expect = require('expect');
var transition = require('../src/transition');

describe('transition', function () {
    it('.transition.toString', function () {
        var t = transition('height 2s, max-width 3s ease-in 1s, opacity .1s 1s') + '';
        //height 2000 ease-in 1000, max-width 3000 ease 1000, opacity 100 ease-in 1000
        expect(t).toBe('transition: height 2s ease, max-width 3s ease-in 1s, opacity 100 ease 1s');
    });

    it('.transition.duration', function () {
        var t = transition('height 2s, max-width 3s ease-in 1s, opacity .1s 1s');
        var r = t.duration('1s') + '';

        expect(r).toBe('transition: height 1s ease, max-width 1s ease-in 1s, opacity 1s ease 1s');
    });

    it('.transition opacity .1s 1s', function () {
        var t = transition('opacity .1s 1s');
        expect(t + '').toBe('transition: opacity 100 ease 1s');
    });
    it('.transition opacity .1s', function () {
        var t = transition('opacity .1s');
        expect(t + '').toBe('transition: opacity 100 ease');
    });
    it('.transition new opacity ease-in .1s', function () {
        var t = new transition('opacity .1s ease-in ');
        expect(t + '').toBe('transition: opacity 100 ease-in');
    });

    it('.transition.delay and check timeout', function () {
        var r = (transition('height 2s, max-width 3s ease-in 1s, opacity .1s 1s').delay(333));

        expect(r.timeout()).toBe(3333);
        expect(''+r).toBe('transition: height 2s ease 333, max-width 3s ease-in 333, opacity 100 ease 333');
    });
    it('.wrong order', function () {
        var r = transition().delay(333).duration('111ms, 2s').property('stuff, more, other').timingFunction('cubic, linear');

        expect(''+r).toBe('transition: stuff 111 cubic 333, more 2s linear 333, other 111 cubic 333');
        expect(r.timeout()).toBe(2333);
    });
});