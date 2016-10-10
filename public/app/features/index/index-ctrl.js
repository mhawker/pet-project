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
        "app",
        "app/features/user/user-service.js"
    ], function (angular, app, userService) {
        app.controller("IndexCtrl", function ($location, store) {
            var user = store.loadCurrent();
            if (user.id) {
                $location.path('/todo');
            } else {
                $location.path('/user/login');
            }
        });
    });

}(window.define));
