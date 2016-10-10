/*jslint browser for this */
/*global window */

/**
 * Handle user login/logout requires with the data store and redirect to
 * appropriate screens.
 *
 * NOTE: this currently has zero authentication, it just checks  if the user
 * exists and authenticates them if so. The server needs to enforce access
 * control.
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app",
        "app/services/menu.js",
        "app/services/current-user.js",
        "app/services/model-creator.js",
    ], function (angular, app, menu, current_user) {

        // hook into the global nav menu
        app.run(function ($rootScope, $location, $route) {

            $rootScope.$on("$routeChangeStart", function () {
                var c_u = current_user.fetch();
                if (c_u.id) {
                    menu.add('dashboard', '/user/dashboard', 'Hello ' + c_u.username);
                    menu.add('logout', '/user/logout', 'Log out');
                } else {
                    menu.del('dashboard');
                    menu.del('logout');
                };
            });
        });

        return app.factory("userService", function ($q, modelCreator) {

            var deferred = $q.defer();

            modelCreator.then(function (create_model) {

                /** @var Model the user list item model */
                var user_model = create_model("user", {
                    username: ""
                });

                user_model.loadCurrent = function () {
                    var records = user_model.getRecords();
                    var record = current_user.fetch();
                    angular.copy([], records);
                    records.push(record);
                    return record;
                };

                user_model.setCurrent = function (user) {
                    current_user.persist(user);
                    user_model.loadCurrent();
                };

                /**
                 * Check if a username exists
                 *
                 * @param string username the name to check
                 * @return promise will receive a boolean
                 */
                user_model.checkUsername = function (username) {
                    var api = user_model.getApi();
                    return api.query({
                        username: username
                    }).then(function (response) {
                        return response.length === 1;
                    });
                };

                /**
                 * Call back to the storage layer with the user/pass, which the
                 * storage layer can use to authenticate the user (or not).
                 *
                 * @param string username the submitted username
                 * @param string password the submitted password
                 */
                user_model.checkCredentials = function (username, password) {
                    var api = user_model.getApi();
                    return api.query({
                        username: username,
                        password: password
                    }).then(function (response) {
                        var user = {};
                        if (response.length === 1) {
                            user = response.shift();
                        }
                        current_user.persist(user);
                        return user;
                    }, function () {
                        current_user.persist({});
                        return {};
                    });
                };

                /**
                 * Call back to the storage layer with a the user/pass, log
                 * the user in with that user/pass.
                 *
                 * @param string username the submitted username
                 * @param string password the submitted password
                 */
                user_model.create = function (username, password) {
                    return user_model.checkUsername(username).then(function (exists) {
                        var api = user_model.getApi();
                        return api.save({
                            username: username,
                            password: password
                        }).then(function (response) {
                            return response;
                        });
                    })
                };

                deferred.resolve(user_model);
            });

            return deferred.promise;
        });
    });
}(window.define));