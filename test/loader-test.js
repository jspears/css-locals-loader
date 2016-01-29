"use strict";

var expect = require('expect');
var loader = require('../');

describe('css-locals-loader', function () {
    it('should load this', function (done) {
        var src = `exports = module.exports = require("./../../node_modules/css-loader/lib/css-base.js")();
// imports


// module
exports.push([module.id, "._2EQ4__grow__appear{transition:height 1s ease,width 1s ease,margin 1s ease,padding 1s ease;height:0;width:0;overflow:hidden}._2EQ4__grow__appear._1oQAE_grow__appearActive{height:auto;width:auto}._2FWfK_grow__enter{transition:height 1s ease,width 1s ease,margin 1s ease,padding 1s ease;height:0;width:0;overflow:hidden}._1BDEe_grow__leave,._2FWfK_grow__enter._-BZfC_grow__enterActive{height:auto;width:auto}._1BDEe_grow__leave{transition:height 1s ease,width 1s ease,margin 1s ease,padding 1s ease;overflow:hidden}._1BDEe_grow__leave._1YqMH_grow__leaveActive{height:0;width:0;margin:0;padding:0}", ""]);

// exports
exports.locals = {
	"appear": "_2EQ4__grow__appear",
	"appearActive": "_1oQAE_grow__appearActive",
	"enter": "_2FWfK_grow__enter",
	"enterActive": "_-BZfC_grow__enterActive",
	"leave": "_1BDEe_grow__leave",
	"leaveActive": "_1YqMH_grow__leaveActive"
};
    `
        var lu = false, cacheable = false;

        function localUpdate() {
            lu = true;
        }

        loader.call({
            cacheable(){
                cacheable = true;
            },
            query: '',
            options: {
                cssLocals: {
                    'css-locals-dimension': {
                        localUpdate
                    },
                    'css-locals-transition': null
                }
            },
            async(){
                return function (err, value) {
                    expect(value).toExist();
                    expect(lu).toBe(true);
                    expect(cacheable).toBe(true);
                    done();
                }
            }
        }, src, {});
    })
});