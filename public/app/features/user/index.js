/*jslint browser */
/*global window */

/**
 * Load the user feature
 */
(function (define) {
    "use strict";
    define([
        "./user-service.js",
        "./user-route.js",
        "./dashboard/user-dashboard-ctrl.js",
        "./login/user-login-ctrl.js",
        "./logout/user-logout-ctrl.js",
        "./register/user-register-ctrl.js"
    ], function () {
        return undefined;
    });
}(window.define));
