/*jslint browser */
/*global window */

/**
 * Load all features
 */
(function (define) {
    "use strict";
    define([
        "./index/index.js",
        "./user/index.js",
        "./lists/index.js",
        "./todo/index.js" // must be last
    ], function () {
        return undefined;
    });
}(window.define));
