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
        "./directives/index",
        "./filters/index",
        "./services/index",
        "./features/index"
    ], function (require, ng) {
        require(["domReady!"], function (document) {
            ng.bootstrap(document, ["todomvc"]);
        });
    });
}(window.define));
