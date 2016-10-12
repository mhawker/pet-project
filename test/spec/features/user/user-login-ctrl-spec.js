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
        "features/user/login/user-login-ctrl"
    ], function () {
        describe("UserLoginCtrl", function () {
            var location, scope, store, menu, flash, users_created, current_user;

            beforeEach(module("todomvc"));

            beforeEach(inject(function (resourceCreator, currentUserService) {
                resourceCreator.setResourceType("faux");
                current_user = currentUserService;
                current_user.persist({});
            }));

            beforeEach(inject(function ($controller, $rootScope, $location, userService, menuService, flashService) {
                scope = $rootScope.$new();
                menu = menuService;
                location = $location;
                flash = flashService;

                menu.breadcrumb([
                    {url: "/a", text: "A"},
                    {url: "/b", text: "B"}
                ]);

                userService().then(function (user_model) {
                    if (!users_created) {
                        users_created = true;
                        user_model.create("test-user-1", "1234");
                        user_model.create("test-user-2", "abcd");
                    }
                    store = user_model;
                    $controller("UserLoginCtrl", {
                        $scope: scope,
                        $location: location,
                        store: store,
                        menuService: menu,
                        flashService: flash
                    });
                });
            }));

            it("Should have cleared the breadcrumb", function () {
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

            it("Should flash warn user does not exist", function () {
                scope.$digest();
                scope.user = {username: "nobody", "password": "nopass"};
                scope.submitForm();
                scope.$digest();
                var msg = flash.getLast();
                expect(msg.type).toBe("warning");
                expect(msg.msg).toBe("Username does not exist");
            });

            it("Should flash warn that password is bad", function () {
                scope.$digest();
                scope.user = {username: "test-user-1", "password": "xyz"};
                scope.submitForm();
                scope.$digest();
                var msg = flash.getLast();
                expect(msg.type).toBe("error");
                expect(msg.msg).toBe("Invalid password");
            });
            it("Should log the user in", function () {
                scope.$digest();
                spyOn(location, "path");
                scope.user = {username: "test-user-1", "password": "1234"};
                scope.submitForm();
                scope.$digest();
                expect(current_user.fetch().username).toBe("test-user-1");
                expect(flash.getLast().type).toBe("success");
                expect(location.path).toHaveBeenCalledWith("/");
            });
        });
    });
}());

