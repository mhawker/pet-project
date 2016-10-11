/*jslint browser */
/*global window */

/**
 * The routes to an individual to-do list
 */
(function (define) {
    "use strict";
    define([
        "app",
        "/app/services/current-user.js"
    ], function (app, current_user) {
        return app.config(function ($routeProvider) {
            var routeConfig = {
                controller: "TodoCtrl",
                templateUrl: "app/features/todo/todo-view.html",
                resolve: {
                    store: function ($route, todoService) {
                        // Wait for the model to decide on its persistence
                        // layer then load the entities in the background
                        return todoService.then(function (module) {
                            // NOTE: $routeParams doesn't seem to work this early
                            module.force_params({
                                user_id: parseInt(current_user.fetch().id, 10),
                                list_id: parseInt($route.current.params.list_id)
                            });
                            module.read();
                            return module;
                        });
                    }
                }
            };

            $routeProvider
                .when("/todo/:list_id", routeConfig)
                .when("/todo/:list_id/:status", routeConfig);
        });
    });
}(window.define));
