"use strict";
var expect = require('expect');
var localsLoad = require('../src/locals-load');

describe('locals-load', function () {
    it('should return css-locals-transition', function () {
        var f = localsLoad('css-locals-transition', {});
        expect(f.length).toBe(1);
        expect(f[0].name).toBe('cssLocalsTransition$postCssPlugin');
    });


    it('should parse strings', function () {
        var f = localsLoad('css-locals-dimension, css-locals-transition', {});
        expect(f.length).toBe(2);
        expect(f[0].name).toBe('extractDimensions$return');
        expect(f[1].name).toBe('cssLocalsTransition$postCssPlugin');
    });
    it('should use an array', function () {
        var f = localsLoad(['css-locals-dimension', 'css-locals-transition'], {});
        expect(f.length).toBe(2);
        expect(f[0].name).toBe('extractDimensions$return');
        expect(f[1].name).toBe('cssLocalsTransition$postCssPlugin');
    });
    it('should allow mixed array', function () {
        var f = localsLoad([require('../src/css-locals-dimension'), 'css-locals-transition'], {});
        expect(f.length).toBe(2);
        expect(f[0].name).toBe('extractDimensions$return');
        expect(f[1].name).toBe('cssLocalsTransition$postCssPlugin');
    });
});