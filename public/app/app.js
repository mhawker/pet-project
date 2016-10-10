/*jslint browser */
/*global window */

/**
 * Create the app, none of our business logic.
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "angularResource",
        "angularRoute"
    ], function (angular) {
        return angular.module("todomvc", [
            "ngResource",
            "ngRoute"
        ]);
    });
}(window.define));
