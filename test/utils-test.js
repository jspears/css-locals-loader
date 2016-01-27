"use strict";
var expect = require('expect');
var utils = require('../src/utils');

describe("utils", function () {
    describe("#toMillis", function () {

        [0, '0', '0ms', '0s', '0.0', '0.0s', '0.00ms'].forEach(function (unit) {
            it('should convert "' + unit + '" to 0', function () {
                expect(utils.toMillis(unit)).toBe(0);
            });
        });

        [1000, '1000', '1s', '1.0s', '1000ms', '1000.00ms'].forEach(function (unit) {
            it('should convert "' + unit + '" to 1000', function () {
                expect(utils.toMillis(unit)).toBe(1000);
            });
        });
    });

    describe('#toNiceTimeUnits', function () {
        var map = {
            '1000': '1s',
            '100': 100,
            '10': 10,
            '100ms': 100,
            '.0010s': 1,
            '3000': '3s',
            '21232.22ms':21232.22,
            //if the transformed length is the same as the original length return the original.
            '3.4s': '3.4s',
            '30.00': 30,
            '30.00s': '30s'
        };
        Object.keys(map).forEach(function (key) {
            it('should convert to ' + key + ' to ' + map[key], function () {
                expect(utils.toNiceTimeUnits(key) + '').toBe('' + map[key]);
            });
        })
    });
    describe('#repeatAt', function () {
        for (var i = 0; i < 3; i++) {
            it('should return first ' + i + ' ' + (i % 3), function () {
                expect(utils.repeatAt(i, [0, 1, 2])).toBe(i % 3);
            })
        }
        it('should return default, if array is empty', function () {
            expect(utils.repeatAt(2, [], 3)).toBe(3);
        });
    });
});