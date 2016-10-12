/*jslint browser */
/*global window */

/**
 * The controller for the user registration screen
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {

        app.controller("UserRegisterCtrl", function ($scope, $location, store, menuService, flashService) {
            menuService.breadcrumb([]);
            $scope.submitForm = function () {
                flashService("info", "Checking...");
                var user = $scope.user || {};
                var u = user.username;
                var p = user.password;
                if (!u || !p) {
                    return flashService("warning", "Both username and password required");
                }
                store.checkUsername(u).then(function (exists) {
                    if (exists) {
                        flashService("danger", "Username already exists");
                    } else {
                        store.create(u, p).then(function (user) {
                            flashService("success", "Account created");
                            store.setCurrent(user);
                            $location.path("/");
                        });
                    }
                });
            };
        });
    });

}(window.define));
