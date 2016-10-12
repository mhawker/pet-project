/*jslint browser */
/*global window */


/**
 * This filter exists exclusively to run unit tests against to make sure
 * they're loading right with requirejs.
 *
 * See http://monicalent.com/blog/2015/02/11/karma-tests-angular-js-require-j/
 */
(function (define) {
    "use strict";
    define([
        "app"
    ], function (app) {
        var FILTER_NAME = "testMetaFilter";
        var filter = function () {
            return function (input, option) {
                return input + option;
            };
        };
        app.filter(FILTER_NAME, filter);
        return filter;
    });
}(window.define));
