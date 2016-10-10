/*jslint browser */
/*global window */

/**
 * The main controller for the todo feature. It does:
 * - retrieves and persists the model via the todoService service
 * - exposes the model to the template and provides event handlers
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app"
    ], function (angular, app) {

        // this is supposed to be a directive... maybe later
        function feedback(msg) {
            var el = angular.element(document.querySelector('[id="feedback"]'));
            el.html(msg);
        }

        app.controller("UserRegisterCtrl", function ($scope, $location, store) {
            $scope.submitForm = function () {
                feedback('Checking...');
                var u = $scope.user.username;
                var p = $scope.user.password;
                if (!u || !p) {
                    return feedback('Both username and password required');
                }
                store.checkUsername(u).then(function (exists) {
                    if (exists) {
                        return feedback('Username already exists');
                    }
                    store.create(u, p).then(function (user) {
                        store.setCurrent(user);
                        $location.path('/todo');
                    });
                }); 
            };
        });
    });

}(window.define));
