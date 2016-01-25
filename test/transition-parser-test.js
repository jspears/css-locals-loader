"use strict";
var expect = require('expect');
var tp = require('../src/transition-parser');
var properties = [
    'margin-left 4s',
    'margin-left 3s 1s',
    'margin-left 3s ease-in-out 1000.0',
    'margin-left 300ms ease-in-out 3.7s',
    'all 4000ms ease-out'
];
describe("transition-parser", function () {
    describe("#toMillis", function () {

        [0, '0', '0ms', '0s', '0.0', '0.0s', '0.00ms'].forEach(function (unit) {
            it('should convert "' + unit + '" to 0', function () {
                expect(tp.toMillis(unit)).toBe(0);
            });
        });

        [1000, '1000', '1s', '1.0s', '1000ms', '1000.00ms'].forEach(function (unit) {
            it('should convert "' + unit + '" to 1000', function () {
                expect(tp.toMillis(unit)).toBe(1000);
            });
        });
    });

    describe('#calcDelay', function () {
        properties.forEach(function (expr) {
            it('should calc to "' + expr + '" to 4000', function () {
                expect(tp.calcDelay(expr)).toBe(4000);
            });
        })
    });
    describe('#calcMax', function () {
        it('should calculate max', function () {
            expect(tp.calcMax(properties.join(', '))).toBe(4000);
        });
        var props = [
            'margin-left 1s',
            'margin-left 1700ms .3s',
            'margin-left 2s ease-in-out 1000.0ms',
            'margin-left 300ms ease-in-out 3.7s',
            'all 5000ms ease-out'
        ];
        props.forEach(function (prop, i) {
            i = i + 1;
            var val = i * 1000;
            var p = props.slice(0, i).join(',');
            it('should find the max from "' + p + '" to be "' + val + '"', function () {
                expect(tp.calcMax(p)).toBe(val);
            });
        })
    });
    describe('#calcMax with funky timings', function () {
        it('should find 4s', function () {
            expect(tp.calcMax('max-height 1.5s cubic-bezier(0, 1.05, 0, 1), opacity 4s cubic-bezier(0, 1.05, 0, 1)')).toBe(4000);
        });

    })
});