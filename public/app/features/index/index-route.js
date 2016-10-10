/*jslint browser */
/*global window */

/**
 * The routes to an individual to-do list
 */
(function (define) {
    "use strict";
    define([
        "app",
        "app/features/user/user-service.js"
    ], function (app) {
        return app.config(function ($routeProvider) {
            $routeProvider.when("/", {
                controller: "IndexCtrl",
                templateUrl: "app/features/index/index-view.html",
                resolve: {
                    store: function (userService) {
                        return userService.then(function (module) {
                            module.loadCurrent();
                            return module;
                        });
                    }
                }
            });
        });
    });
}(window.define));
