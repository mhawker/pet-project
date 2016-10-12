/*jslint browser multivar */
/*global define describe it expect beforeEach inject module spyOn */

/**
 * The unit test for the user login controller
 */
(function () {
    "use strict";
    define([
        "angular",
        "angularMocks",
        "services/index",
        "features/index/index-ctrl"
    ], function () {
        describe("IndexCtrl", function () {
            var location, ctrl, scope, current_user;

            beforeEach(module("todomvc"));

            beforeEach(inject(function ($controller, $rootScope, $location, currentUserService) {
                scope = $rootScope.$new();
                location = $location;
                current_user = currentUserService;

                spyOn(location, "path");
                ctrl = $controller;
            }));

            it("Should redirect logged in users to dashboard", function () {
                current_user.persist({id: 4});
                ctrl("IndexCtrl", {
                    $scope: scope,
                    $location: location,
                    currentUserService: current_user
                });
                expect(location.path).toHaveBeenCalledWith("/user/dashboard");
            });

            it("Should redirect logged out users to login", function () {
                current_user.persist({});
                ctrl("IndexCtrl", {
                    $scope: scope,
                    $location: location,
                    currentUserService: current_user
                });
                expect(location.path).toHaveBeenCalledWith("/user/login");
            });
        });
    });
}());

