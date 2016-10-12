/*jslint browser multivar */
/*global define describe it expect beforeEach inject module */

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
        "features/user/dashboard/user-dashboard-ctrl"
    ], function () {
        describe("UserDashboardCtrl", function () {
            var scope, current_user, menu;

            beforeEach(module("todomvc"));

            beforeEach(inject(function ($controller, $rootScope, currentUserService, menuService) {
                scope = $rootScope.$new();
                current_user = currentUserService;
                menu = menuService;

                $controller("UserDashboardCtrl", {
                    $scope: scope,
                    currentUserService: current_user,
                    menuService: menu
                });
            }));

            it("Should populate the breadcrumb", function () {
                expect(menu.breadcrumb.getLast().length).toBe(2);
            });
        });
    });
}());
