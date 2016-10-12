/*jslint browser for this */
/*global window */

/**
 * Generate the storage object for to-do list items; handle interfacing with
 * persistence layer.
 */
(function (define) {
    "use strict";
    define(["angular", "app"], function (angular, app) {

        return app.factory("todoService", function ($q, modelCreator) {
            return function () {
                var deferred = $q.defer();

                modelCreator("todo", {
                    title: "",
                    completed: false
                }).then(function (todo_model) {

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
            };
        });
    });
}(window.define));
