"use strict";
var expect = require('expect');
var localsLoad = require('../src/locals-load');

describe('locals-load', function () {
    it('should return css-locals-transition', function () {
        var f = localsLoad('css-locals-transition', {});
        expect(f.length).toBe(1);
        expect(f[0].name).toBe('cssLocalsTransition$postCssPlugin');
    });
    it('should return test/css-locals-junk', function () {
        var f = localsLoad('../../../test/css-locals-junk.js', {});
        expect(f.length).toBe(1);
        expect(f[0].name).toBe('cssLocalsJunk$return');
    });

    it('should parse strings', function () {
        var f = localsLoad('../../../test/css-locals-junk.js, css-locals-transition', {});
        expect(f.length).toBe(2);
        expect(f[0].name).toBe('cssLocalsJunk$return');
        expect(f[1].name).toBe('cssLocalsTransition$postCssPlugin');

    });
});