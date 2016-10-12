/*jslint browser */
/*global window */

/**
 * The default controller, handles redirecting to an appropriate dashboard
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {
        app.controller("IndexCtrl", function ($location, currentUserService) {
            var user = currentUserService.fetch();
            if (user.id) {
                $location.path("/user/dashboard");
            } else {
                $location.path("/user/login");
            }
        });
    });

}(window.define));
