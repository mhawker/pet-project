/*jslint browser */
/*global window */

/**
 * The routes to an individual to-do list
 */
(function (define) {
    "use strict";
    define([
        "app",
        "app/services/current-user.js"
    ], function (app, current_user) {
        return app.config(function ($routeProvider) {
            var routeConfig = {
                controller: "ListsCtrl",
                templateUrl: "app/features/lists/lists-view.html",
                resolve: {
                    store: function (listsService) {
                        return listsService.then(function (module) {
                            var c_u = current_user.fetch();
                            module.read({user_id: c_u.id});
                            return module;
                        });
                    }
                }
            };

            $routeProvider
                .when("/lists", routeConfig);
        });
    });
}(window.define));
