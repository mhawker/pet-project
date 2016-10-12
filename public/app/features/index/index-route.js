/*jslint browser */
/*global window */

/**
 * The routes for the default controller. Be sure to include it last.
 */
(function (define) {
    "use strict";
    define([
        "app",
        "features/user/user-service"
    ], function (app) {
        return app.config(function ($routeProvider) {
            $routeProvider.when("/", {
                controller: "IndexCtrl",
                templateUrl: "app/features/index/index-view.html"
            }).otherwise({redirectTo: "/"});
        });
    });
}(window.define));
