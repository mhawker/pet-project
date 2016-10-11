/*jslint browser */
/*global window */

/**
 * The controller for the user registration screen
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app",
        "app/services/menu.js"
    ], function (angular, app, menu) {

        // this is supposed to be a directive... maybe later
        function feedback(msg) {
            var el = angular.element(document.querySelector("[id='feedback']"));
            el.html(msg);
        }

        app.controller("UserRegisterCtrl", function ($scope, $location, store) {
            menu.breadcrumb([]);
            $scope.submitForm = function () {
                feedback("Checking...");
                var u = $scope.user.username;
                var p = $scope.user.password;
                if (!u || !p) {
                    return feedback("Both username and password required");
                }
                store.checkUsername(u).then(function (exists) {
                    if (exists) {
                        return feedback("Username already exists");
                    }
                    store.create(u, p).then(function (user) {
                        store.setCurrent(user);
                        $location.path("/todo");
                    });
                });
            };
        });
    });

}(window.define));
