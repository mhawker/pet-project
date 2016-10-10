/*jslint browser for this */
/*global window */

/**
 * Generate the storage object for to-do list items; handle interfacing with
 * persistence layer.
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app",
        "/app/services/current-user.js",
        "/app/services/menu.js",
        "/app/services/model-creator.js"
    ], function (angular, app, current_user, menu) {

        // hook into the global nav menu
        app.run(function ($rootScope, $location, $route) {
            $rootScope.$on("$routeChangeStart", function () {
                var c_u = current_user.fetch();
                if (c_u.id) {
                    menu.add('lists', '/lists', 'My TODO lists');
                } else {
                    menu.del('lists');
                };
            });
        });
        
        return app.factory("listsService", function ($q, modelCreator) {

            var deferred = $q.defer();

            modelCreator.then(function (create_model) {

                var u = current_user.fetch();

                /** @var Model the to-do list model */
                var lists_model = create_model("lists", {
                    title: "",
                    user_id: u.id
                });

                lists_model.force_params({
                    user_id: u.id
                });
                deferred.resolve(lists_model);
            });

            return deferred.promise;
        });
    });
}(window.define));
