/*jslint browser multivar */
/*global define describe it expect beforeEach inject module */

/**
 * The unit test for the to-do list controller
 */
(function () {
    "use strict";
    define([
        "app",
        "features/lists/lists-ctrl",
        "features/lists/lists-service",
        "angularMocks"
    ], function () {
        describe("Lists Controller", function () {
            var scope, store, menu, current_user;

            var unique_name = (function () {
                var count = 0;
                return function () {
                    count += 1;
                    return "Test list " + count;
                };
            }());

            beforeEach(module("todomvc"));

            beforeEach(inject(function (resourceCreator, currentUserService) {
                resourceCreator.setResourceType("faux");
                current_user = currentUserService;
                current_user.persist({id: 4, username: "test-user-1"});
            }));

            beforeEach(inject(function ($controller, $rootScope, $filter, listsService, menuService) {

                scope = $rootScope.$new();
                menu = menuService;

                menu.breadcrumb([]);

                listsService().then(function (lists_model) {
                    store = lists_model;
                    $controller("ListsCtrl", {
                        $scope: scope,
                        $filter: $filter,
                        store: store,
                        menuService: menu
                    });
                });

            }));

            it("should populate the breadcrumb", function () {
                scope.$digest();
                expect(menu.breadcrumb.getLast().length).toBe(2);
            });

            it("should not have an edited list on start", function () {
                scope.$digest();
                expect(scope.editedList).toBeNull();
            });

            it("should not have any lists on start", function () {
                scope.$digest();
                expect(scope.lists.length).toBe(0);
            });

            it("should save new lists", function () {
                scope.$digest();
                scope.newList = unique_name();
                scope.addList();
                scope.$digest();
                scope.newList = unique_name();
                scope.addList();
                scope.$digest();
                store.read().then(function (r) {
                    expect(scope.lists.length).toBe(2);
                    expect(r.length).toBe(2);
                });
                scope.$digest();
            });

            it("should save edits", function () {
                scope.$digest();
                scope.newList = unique_name();
                scope.addList();
                scope.$digest();
                var lists = store.getRecords();
                var list = lists[lists.length - 1];
                var new_title = unique_name();
                scope.editList(list);
                list.title = new_title;
                scope.saveEdits(list);
                scope.$digest();
                expect(list.title).toBe(new_title);
            });

            it("should trim list titles on saving", function () {
                var title = unique_name();
                // on new
                scope.$digest();
                scope.newList = " " + title + " ";
                scope.addList();
                scope.$digest();
                var lists = store.getRecords();
                var list = lists[lists.length - 1];
                expect(list.title).toBe(title);
                // on edit
                scope.editList(list);
                list.title = " " + title + " ";
                scope.saveEdits(list);
                scope.$digest();
                expect(list.title).toBe(title);
            });

            it("should revert edited lists w/o title on saving", function () {
                scope.$digest();
                scope.newList = "test list 1";
                scope.addList();
                scope.$digest();

                var lists = store.getRecords();
                var list = lists[lists.length - 1];

                scope.editList(list);
                list.title = "";
                scope.saveEdits(list);
                scope.$digest();
                expect(list.title).toBe("test list 1");
            });

            it("should not display other user's lists", function () {
                store.getApi().save({
                    title: "private list",
                    user_id: 6
                }).then(function (r) {
                    expect(scope.lists.length).toBe(2);
                    expect(r.length).toBe(2);
                });
            });
        });
    });
}());
