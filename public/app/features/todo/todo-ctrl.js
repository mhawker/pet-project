/*jslint browser */
/*global window */

/**
 * The main controller for the todo feature. It does:
 * - retrieves and persists the model via the todoService service
 * - exposes the model to the template and provides event handlers
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app"
    ], function (angular, app) {
        app.controller("TodoCtrl", function TodoCtrl($scope, $routeParams, $filter, store) {
            var todos = $scope.todos = store.getRecords();
            $scope.newTodo = "";
            $scope.editedTodo = null;

            $scope.$watch("todos", function () {
                $scope.remainingCount = $filter("filter")(todos, {completed: false}).length;
                $scope.completedCount = todos.length - $scope.remainingCount;
                $scope.allChecked = !$scope.remainingCount;
                $scope.list_id = $routeParams.list_id;
            }, true);

            // Monitor the current route for changes and adjust the filter accordingly.
            $scope.$on("$routeChangeSuccess", function () {
                var status = $scope.status = $routeParams.status || "";

                if (status === "active") {
                    $scope.statusFilter = {completed: false};
                }
                else if (status === "completed") {
                    $scope.statusFilter = {completed: true};
                }
                else {
                    $scope.statusFilter = {};
                }
            });

            $scope.addTodo = function () {
                var newTodo = {
                    title    : $scope.newTodo.trim(),
                    completed: false
                };

                if (!newTodo.title) {
                    return;
                }

                $scope.saving = true;
                store.create(newTodo)
                    .then(function success() {
                        $scope.newTodo = "";
                    })
                    .finally(function () {
                        $scope.saving = false;
                    });
            };

            $scope.editTodo = function (todo) {
                $scope.editedTodo = todo;
                // Clone the original todo to restore it on demand.
                $scope.originalTodo = angular.extend({}, todo);
            };

            $scope.saveEdits = function (todo, event) {
                // Blur events are automatically triggered after the form submit event.
                // This does some unfortunate logic handling to prevent saving twice.
                if (event === "blur" && $scope.saveEvent === "submit") {
                    $scope.saveEvent = null;
                    return;
                }

                $scope.saveEvent = event;

                if ($scope.reverted) {
                    // Todo edits were reverted-- don't save.
                    $scope.reverted = null;
                    return;
                }

                todo.title = todo.title.trim();

                if (todo.title === $scope.originalTodo.title) {
                    $scope.editedTodo = null;
                    return;
                }

                store[todo.title ? "update" : "delete"](todo)
                    .then(function success() {
                    }, function error() {
                        todo.title = $scope.originalTodo.title;
                    })
                    .finally(function () {
                        $scope.editedTodo = null;
                    });
            };

            $scope.revertEdits = function (todo) {
                todos[todos.indexOf(todo)] = $scope.originalTodo;
                $scope.editedTodo = null;
                $scope.originalTodo = null;
                $scope.reverted = true;
            };

            $scope.removeTodo = function (todo) {
                store.delete(todo);
            };

            $scope.saveTodo = function (todo) {
                store.update(todo);
            };

            $scope.toggleCompleted = function (todo, completed) {
                if (angular.isDefined(completed)) {
                    todo.completed = completed;
                }
                store.update(todo)
                    .then(function success() {
                    }, function error() {
                        todo.completed = !todo.completed;
                    });
            };

            $scope.clearCompletedTodos = function () {
                store.clearCompleted();
            };

            $scope.markAll = function (completed) {
                todos.forEach(function (todo) {
                    if (todo.completed !== completed) {
                        $scope.toggleCompleted(todo, completed);
                    }
                });
            };
        });
    });
}(window.define));
