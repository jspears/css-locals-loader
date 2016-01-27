"use strict";
var expect = require('expect');
var animation = require('../src/animation');

describe('animation', function () {
    it('4s linear 0s infinite alternate move_eye', function () {
        var t = animation('4s linear 0s infinite alternate move_eye') + '';
        expect(t).toBe('animation: 4000 linear 0 infinite alternate none running move_eye');
    });

    it('3s ease-in 1s 2 reverse both paused slidein', function () {
        var t = animation('3s ease-in 1.1s 2 reverse both paused slidein');
        expect(t.timeout()).toBe(8200)
        t.duration('1s');
        expect(t.timeout()).toBe(4200)
        expect(t + '').toBe('animation: 1000 ease-in 1100 2 reverse both paused slidein');
    });

});