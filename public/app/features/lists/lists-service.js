/*jslint browser for this */
/*global window */

/**
 * Generate the storage object for to-do list items; handle interfacing with
 * persistence layer.
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {

        return app.factory("listsService", function ($q, modelCreator, currentUserService) {
            return function () {
                var deferred = $q.defer();

                /** @var object the currently logged in user */
                var current_user = currentUserService.fetch();

                modelCreator("lists", {
                    title: "",
                    user_id: current_user.id
                }).then(function (lists_model) {

                    // force the model to only fetch records for the current user
                    lists_model.force_params({
                        user_id: current_user.id
                    });

                    deferred.resolve(lists_model);
                });

                return deferred.promise;
            };
        });
    });
}(window.define));
