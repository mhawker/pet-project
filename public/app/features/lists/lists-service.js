/*jslint browser for this */
/*global window */

/**
 * Generate the storage object for to-do list items; handle interfacing with
 * persistence layer.
 */
(function (define) {
    "use strict";
    define([
        "app",
        "/app/services/current-user.js",
        "/app/services/model-creator.js"
    ], function (app) {

        return app.factory("listsService", function ($q, modelCreator, currentUserService) {

            var deferred = $q.defer();

            modelCreator.then(function (create_model) {

                /** @var object the currently logged in user */
                var current_user = currentUserService.fetch();

                /** @var Model the to-do list model */
                var lists_model = create_model("lists", {
                    title: "",
                    user_id: current_user.id
                });

                // force the model to only fetch records for the current user
                lists_model.force_params({
                    user_id: current_user.id
                });

                deferred.resolve(lists_model);
            });

            return deferred.promise;
        });
    });
}(window.define));
