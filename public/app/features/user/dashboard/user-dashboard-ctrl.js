/*jslint browser */
/*global window */

/**
 * The user dashboard is currently very basic, it simply provides a link to the
 * lists feature and a logout link.
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {
        app.controller("UserDashboardCtrl", function ($scope, currentUserService, menuService) {
            menuService.breadcrumb([
                {url: "/", text: "Home"},
                {url: "/user/dashboard", text: "Dashboard"}
            ]);
            $scope.username = currentUserService.fetch().username;
        });
    });

}(window.define));
