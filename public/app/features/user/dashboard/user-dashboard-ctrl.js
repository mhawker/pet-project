/*jslint browser */
/*global window */

/**
 * The main controller for the todo feature. It does:
 * - retrieves and persists the model via the todoService service
 * - exposes the model to the template and provides event handlers
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app"
    ], function (angular, app) {

        app.controller("UserDashboardCtrl", function ($scope, $location, store) {
            // nothing to do now
        });
    });

}(window.define));
