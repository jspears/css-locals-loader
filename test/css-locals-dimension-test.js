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
            expect(stuff['@enterHeight']).toBe('height 2s ease');
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
            expect(stuff['@enterHeight']).toBe('height 0');
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
              transition: height  2s ease, opacity 1s ease-in-out;
            }
            .no-enter-active {
              height:auto;
            }

       `).then(function () {
            expect(stuff['@enterActiveHeight']).toBe('height 2s ease,opacity 1s ease-in-out');
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
              transition-duration:1s;
              transition-delay:2s;
              transition-timing-function:ease-in;
            }
            .no-enter-active {
              height:auto;
            }

       `).then(function () {
            expect(stuff['@enterActiveHeight']).toBe("opacity 1s ease-in 2s,height 1s ease-in 2s");
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
            expect(stuff['@enterActiveMaxHeight']).toBe('max-height 1500 ease,opacity 1500 ease');
        });
    });

    it('should transition based destination height', function () {
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
  max-height: auto;
} `).then(function () {
            expect(stuff['@enterActiveMaxHeight']).toBe('max-height 1500 ease,opacity 1500 ease');
        });
    });


});