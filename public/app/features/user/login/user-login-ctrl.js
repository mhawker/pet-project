/*jslint browser */
/*global window */

/**
 * The login screen controller
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {

        app.controller("UserLoginCtrl", function ($scope, $location, store, menuService, flashService) {
            menuService.breadcrumb([]);
            $scope.submitForm = function () {
                var submitted = $scope.user || {};
                var u = submitted.username;
                var p = submitted.password;
                flashService("info", "Checking");
                if (!u || !p) {
                    return flashService("warning", "Both username and password required");
                }
                store.checkUsername(u).then(function (exists) {
                    if (!exists) {
                        return flashService("warning", "Username does not exist");
                    }
                    store.checkCredentials(u, p).then(function (user) {
                        if (user.id) {
                            flashService("success", "You've logged in");
                            $location.path("/");
                        } else {
                            flashService("error", "Invalid password");
                        }
                    });
                });
            };
        });
    });

}(window.define));
