/*jslint browser */
/*global window */

/**
 * Load app, initialize business logic, then bootstrap.
 */
(function (define) {
    "use strict";
    define([
        "require",
        "angular",
        "./app.js",
        "./directives/index.js",
        "./filters/index.js",
        "./services/index.js",
        "./features/index.js"
    ], function (require, ng) {
        require(["domReady!"], function (document) {
            ng.bootstrap(document, ["todomvc"]);
        });
    });
}(window.define));
