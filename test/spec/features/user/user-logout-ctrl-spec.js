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
        "features/user/user-service",
        "features/user/logout/user-logout-ctrl"
    ], function () {
        describe("UserLogoutCtrl", function () {
            var location, scope, current_user;

            beforeEach(module("todomvc"));

            beforeEach(inject(function ($controller, $rootScope, $location, currentUserService) {
                scope = $rootScope.$new();
                location = $location;
                current_user = currentUserService;

                spyOn(location, "path");

                $controller("UserLogoutCtrl", {
                    $scope: scope,
                    $location: location,
                    currentUserService: current_user
                });
            }));

            it("Should end the session", function () {
                scope.$digest();
                expect(current_user.id).toBe(undefined);
            });

            it("Redirect to home page", function () {
                scope.$digest();
                expect(location.path).toHaveBeenCalledWith("/");
            });
        });
    });
}());

