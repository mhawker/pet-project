/*jslint browser */
/*global window */

/**
 * The routes for the default controller. Be sure to include it last.
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
            }).otherwise({redirectTo: "/"});
        });
    });
}(window.define));
