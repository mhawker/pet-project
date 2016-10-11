/*jslint browser */
/*global window */

/**
 * The default controller, handles redirecting to an appropriate dashboard
 */
(function (define) {
    "use strict";
    define(["app"], function (app) {
        app.controller("IndexCtrl", function ($location, store) {
            var user = store.loadCurrent();
            if (user.id) {
                $location.path("/user/dashboard");
            } else {
                $location.path("/user/login");
            }
        });
    });

}(window.define));
