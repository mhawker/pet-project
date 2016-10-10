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
        "/app/services/model-creator.js"
    ], function (angular, app) {

        return app.factory("todoService", function ($q, modelCreator) {

            var deferred = $q.defer();

            modelCreator.then(function (create_model) {

                /** @var Model the to-do list item model */
                var todo_model = create_model("todo", {
                    title: "",
                    completed: false
                });

                /**
                 * Delete items that have been completed from the table
                 *
                 * @return promise
                 */
                todo_model.clearCompleted = function () {
                    var api = todo_model.getApi();
                    var records = todo_model.getRecords();
                    var restore = records.slice(0);
                    var incomplete = records.filter(function (todo) {
                        return !todo.completed;
                    });
                    angular.copy(incomplete, records);
                    return api.delete({
                        completed: true
                    }).then(function () {
                        return undefined;
                    }, function () {
                        angular.copy(restore, records);
                    });
                };
                deferred.resolve(todo_model);
            });

            return deferred.promise;
        });
    });
}(window.define));
