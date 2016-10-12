/*jslint browser */
/*global window */

/**
 * The controller for user logout. Does the logout and sends the user to "/"
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {
        app.controller("UserLogoutCtrl", function ($location, currentUserService) {
            currentUserService.persist({});
            $location.path("/");
        });
    });

}(window.define));
