"use strict";
var expect = require('expect');
var extractHeight = require('../src/css-locals-dimension');
var postcss = require('postcss');
describe('css-locals-dimension', function () {


    it('should extract height in same rule', function () {
        var stuff = {
            'enter': 'no_enter'
        };
        return postcss([extractHeight(stuff)]).process(`
            .no_enter {
              transition: height 2s ease;
              height:auto;
            }

       `).then(function () {
            expect(stuff['@heightEnter']).toBe(true);
        });
    });
    it('should extract height by property', function () {
        var stuff = {
            'enter': 'no_enter'
        };
        return postcss([extractHeight(stuff)]).process(`
            .no_enter {
              transition-property: height;
              height:auto;
            }

       `).then(function () {
            expect(stuff['@heightEnter']).toBe(true);
        });
    });

    it('should extract height by Active', function () {
        var stuff = {
            'enter': 'no-enter',
            'enterActive': 'no-enter-active'
        };
        return postcss([extractHeight(stuff)]).process(`
            .no-enter {
              height:0;
              transition: height  2s ease;
            }
            .no-enter-active {
              height:auto;
            }

       `).then(function () {
            expect(stuff['@heightEnter']).toBe(true);
        });
    });

    it('should extract height by Active property', function () {
        var stuff = {
            'enter': 'no-enter',
            'enterActive': 'no-enter-active'
        };
        return postcss([extractHeight(stuff)]).process(`
            .no-enter {
              height:0;
              transition-property: opacity, height;
            }
            .no-enter-active {
              height:auto;
            }

       `).then(function () {
            expect(stuff['@heightEnter']).toBe(true);
        });
    });
    it('should work with realish css', function () {
        var stuff = {
            enter: 'Sx9h__fadeIn__enter',
            enterActive: '_2AwSa_fadeIn__enterActive'
        };

        return postcss([extractHeight(stuff)]).process(`
        .Sx9h__fadeIn__enter {
  opacity: 0.01;
  transition: max-height 1.5s ease, opacity 1.5s ease;
  max-height: 0;
}
._2AwSa_fadeIn__enterActive {
  overflow: hidden;
  opacity: 1;
  transition: max-height 1.5s ease, opacity 1.5s ease;
  max-height: auto;
} `).then(function () {
            expect(stuff['@maxHeightEnter']).toBe(true);
        });
    });
});