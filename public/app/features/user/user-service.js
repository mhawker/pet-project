/*jslint browser for this */
/*global window */

/**
 * Handle user login/logout requires with the data store and redirect to
 * appropriate screens.
 *
 * NOTE: this currently has zero authentication, it just checks  if the user
 * exists and authorizes them if so. The server needs to enforce access
 * control on various lists/to do items.
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app"
    ], function (angular, app) {

        return app.factory("userService", function ($q, modelCreator, currentUserService) {

            return function () {

                var deferred = $q.defer();

                modelCreator("user", {username: ""}).then(function (user_model) {

                    user_model.loadCurrent = function () {
                        var records = user_model.getRecords();
                        var record = currentUserService.fetch();
                        angular.copy([], records);
                        records.push(record);
                        return record;
                    };

                    user_model.setCurrent = function (user) {
                        currentUserService.persist(user);
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
                            currentUserService.persist(user);
                            return user;
                        }, function () {
                            currentUserService.persist({});
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
                        return user_model.checkUsername(username).then(function () {
                            var api = user_model.getApi();
                            return api.save({
                                username: username,
                                password: password
                            }).then(function (response) {
                                return response;
                            });
                        });
                    };

                    deferred.resolve(user_model);
                });

                return deferred.promise;
            };
        });
    });
}(window.define));
