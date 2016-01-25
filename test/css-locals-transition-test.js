"use strict";
var expect = require('expect');
var postcss = require('postcss');
var transitions = require('../src/css-locals-transition')
describe("css-locals-transitions", function () {

    it('transition-duration/transition-delay', function () {
        var stuff = {
            enter: 'enter'
        };
        return postcss([transitions(stuff)]).process(`
            .enter {
              transition-duration:1000ms, 10ms, 3.8s;
              transition-delay:2s,3.7s,200ms;
            }
        `).then(function () {
            expect(stuff['@enterTimeout']).toBe(4000);
        });
    });

    it('animation-duration/animation-delay', function () {
        var stuff = {
            enter: 'enter'
        };
        return postcss([transitions(stuff)]).process(`
            .enter {
              animation-duration:1000ms, 10ms, 3.8s;
              animation-delay:2s,3.7s,200ms;
            }
        `).then(function () {
            expect(stuff['@enterTimeout']).toBe(4000);
        });
    });

    it('animation with delay and duration', function () {
        var stuff = {
            enter: 'enter'
        };
        return postcss([transitions(stuff)]).process(`
            .enter {
              animation: 3s ease-in 1s 2 reverse both paused slidein;
            }
        `).then(function () {
            expect(stuff['@enterTimeout']).toBe(4000);
        });
    });
    it('animation with duration', function () {
        var stuff = {
            enter: 'enter'
        };
        return postcss([transitions(stuff)]).process(`
            .enter {
              animation: 4s ease-in;
            }
        `).then(function () {
            expect(stuff['@enterTimeout']).toBe(4000);
        });
    });

});