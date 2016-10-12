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
        "features/user/register/user-register-ctrl"
    ], function () {
        describe("UserRegisterCtrl", function () {
            var location, scope, store, menu, flash, users_created;

            beforeEach(module("todomvc"));

            beforeEach(inject(function ($controller, $rootScope, $location, resourceCreator, userService, menuService, flashService) {
                scope = $rootScope.$new();
                menu = menuService;
                location = $location;
                flash = flashService;

                resourceCreator.setResourceType("faux");

                menu.breadcrumb([
                    {url: "/a", text: "A"},
                    {url: "/b", text: "B"}
                ]);

                userService().then(function (user_model) {
                    if (!users_created) {
                        users_created = true;
                        user_model.create("test-user-3", "1234");
                        user_model.create("test-user-4", "abcd");
                    }
                    store = user_model;
                    $controller("UserRegisterCtrl", {
                        $scope: scope,
                        $location: location,
                        store: store,
                        menuService: menu,
                        flashService: flash
                    });
                });
            }));

            it("Should clear the breadcrumb", function () {
                scope.$digest();
                expect(menu.breadcrumb.getLast().length).toBe(0);
            });

            it("Should flash warn that the inputs are empty", function () {
                scope.$digest();
                scope.submitForm();
                scope.$digest();
                var msg = flash.getLast();
                expect(msg.type).toBe("warning");
                expect(msg.msg).toBe("Both username and password required");
            });

            it("Should flash warn if user already exists", function () {
                scope.$digest();
                scope.user = {username: "test-user-3", password: "nopass"};
                scope.submitForm();
                scope.$digest();
                var msg = flash.getLast();
                expect(msg.type).toBe("danger");
                expect(msg.msg).toBe("Username already exists");
            });

            it("Should create an account and log the user in", function () {
                scope.$digest();
                spyOn(location, "path");
                scope.user = {username: "test-user-5", "password": "5678"};
                scope.submitForm();
                scope.$digest();
                expect(flash.getLast().type).toBe("success");
                expect(location.path).toHaveBeenCalledWith("/");
            });
        });
    });
}());

