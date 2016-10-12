/*jslint browser for this */
/*global window */

/**
 * Service for getting/setting info about the currently logged in user
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app"
    ], function (angular, app) {

        /** @var string the key in session storage used to track the user */
        var skey = "TODOMVC.user_login_status";

        /**
         * Get the user from session storage
         *
         * @return object key:value pairs of the user info
         */
        function fetch() {
            return JSON.parse(sessionStorage.getItem(skey) || "{}");
        }

        /**
         * Persist the current user status to the session storage object
         *
         * @param array data
         * @return void
         */
        function persist(data) {
            sessionStorage.setItem(skey, JSON.stringify(data || {}));
        }


        // enforce login for pages that aren't the splash screen
        // http://stackoverflow.com/a/21518472
        app.run(function ($rootScope, $location, $route) {
            var public_routes = [];
            angular.forEach($route.routes, function (route, path) {
                if (route.public_access) {
                    public_routes.push(path);
                }
            });

            $rootScope.$on("$routeChangeStart", function () {
                var current_user = fetch();
                if (public_routes.indexOf($location.path()) < 0 && !current_user.id) {
                    $location.path("/");
                }
            });
        });

        /** @var object the complete module */
        var service = {
            fetch: fetch,
            persist: persist
        };

        // register with angular
        app.factory("currentUserService", function () {
            return service;
        });
        // return to requirejs
        return service;
    });
}(window.define));
