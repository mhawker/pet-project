/*jslint browser */
/*global window */

/**
 * Load all features
 */
(function (define) {
    "use strict";
    define([
        "./index/index",
        "./user/index",
        "./lists/index",
        "./todo/index" // must be last
    ], function () {
        return undefined;
    });
}(window.define));
