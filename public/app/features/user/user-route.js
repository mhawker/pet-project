/*jslint browser */
/*global window */

/**
 * The routes to the various user screens
 */
(function (define) {
    "use strict";
    define([
        "app",
        "./user-service"
    ], function (app) {
        return app.config(function ($routeProvider) {
            var resolve = {
                store: function (userService) {
                    // Wait for the model to decide on its persistence
                    // layer then load the current user in the background
                    return userService().then(function (module) {
                        module.loadCurrent();
                        return module;
                    });
                }
            };
            $routeProvider
                .when("/user/dashboard", {
                    controller: "UserDashboardCtrl",
                    templateUrl: "app/features/user/dashboard/user-dashboard-view.html"
                })
                .when("/user/logout", {
                    controller: "UserLogoutCtrl",
                    templateUrl: "app/features/user/logout/user-logout-view.html",
                    resolve: resolve,
                    public_access: true
                })
                .when("/user/login", {
                    controller: "UserLoginCtrl",
                    templateUrl: "app/features/user/login/user-login-view.html",
                    resolve: resolve,
                    public_access: true
                })
                .when("/user/register", {
                    controller: "UserRegisterCtrl",
                    templateUrl: "app/features/user/register/user-register-view.html",
                    resolve: resolve,
                    public_access: true
                });

        });
    });
}(window.define));
