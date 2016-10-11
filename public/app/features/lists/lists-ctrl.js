/*jslint browser */
/*global window */

/**
 * The main controller for the list feature. It does:
 * - retrieves and persists the model via the listService service
 * - exposes the model to the template and provides event handlers
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app",
        "/app/services/menu.js"
    ], function (angular, app) {
        app.controller("ListsCtrl", function ($scope, $routeParams, $filter, store, menuService) {
            menuService.breadcrumb([
                {url: "/", text: "Home"},
                {url: "/lists", text: "My TODO lists"}
            ]);

            var lists = $scope.lists = store.getRecords();

            $scope.newList = "";
            $scope.editedList = null;

            $scope.$watch("lists", function () {
                $scope.remainingCount = $filter("filter")(lists, {completed: false}).length;
                $scope.completedCount = lists.length - $scope.remainingCount;
                $scope.allChecked = !$scope.remainingCount;
            }, true);

            $scope.addList = function () {
                var newList = {
                    title    : $scope.newList.trim(),
                    completed: false
                };
                if (!newList.title) {
                    return;
                }
                $scope.saving = true;
                store.create(newList)
                    .then(function success() {
                        $scope.newList = "";
                    })
                    .finally(function () {
                        $scope.saving = false;
                    });
            };

            $scope.editList = function (list) {
                $scope.editedList = list;
                // Clone the original list to restore it on demand.
                $scope.originalList = angular.extend({}, list);
            };

            $scope.saveEdits = function (list, event) {
                // Blur events are automatically triggered after the form submit event.
                // This does some unfortunate logic handling to prevent saving twice.
                if (event === "blur" && $scope.saveEvent === "submit") {
                    $scope.saveEvent = null;
                    return;
                }

                $scope.saveEvent = event;

                if ($scope.reverted) {
                    // List edits were reverted-- don't save.
                    $scope.reverted = null;
                    return;
                }

                list.title = list.title.trim();

                if (list.title === $scope.originalList.title) {
                    $scope.editedList = null;
                    return;
                }

                store[list.title ? "update" : "delete"](list)
                    .then(function success() {
                        return undefined;
                    }, function error() {
                        list.title = $scope.originalList.title;
                    })
                    .finally(function () {
                        $scope.editedList = null;
                    });
            };

            $scope.revertEdits = function (list) {
                lists[lists.indexOf(list)] = $scope.originalList;
                $scope.editedList = null;
                $scope.originalList = null;
                $scope.reverted = true;
            };

            $scope.removeList = function (list) {
                store.delete(list);
            };

            $scope.saveList = function (list) {
                store.update(list);
            };
        });
    });
}(window.define));
