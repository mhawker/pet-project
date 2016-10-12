/*jslint browser multivar */
/*global define describe it expect beforeEach inject module */

/**
 * The unit test for the to-do-list controller
 */
(function () {
    "use strict";
    define([
        "angular",
        "features/todo/todo-ctrl",
        "features/todo/todo-service",
        "features/lists/lists-service",
        "angularMocks"
    ], function () {
        describe("Todo Controller", function () {
            var get_ctrl, scope, store, menu, current_user;

            beforeEach(module("todomvc"));

            beforeEach(inject(function (resourceCreator, listsService, currentUserService) {
                resourceCreator.setResourceType("faux");
                current_user = currentUserService;
                current_user.persist({id: 4, username: "test-user-1"});
                listsService().then(function (lists_model) {
                    lists_model.force_values([
                        {id: 1, user_id: 4, title: "Test list 1"},
                        {id: 2, user_id: 4, title: "Test list 2"}
                    ]);
                });
            }));

            beforeEach(inject(function ($controller, $rootScope, $filter, todoService, listsService, menuService) {
                scope = $rootScope.$new();
                menu = menuService;
                menu.breadcrumb([]);

                get_ctrl = function (force_values) {
                    todoService().then(function (todo_model) {
                        store = todo_model;
                        todo_model.force_values(force_values).then(function () {
                            $controller("TodoCtrl", {
                                $scope: scope,
                                $routeParams: {list_id: 2},
                                $filter: $filter,
                                store: store,
                                listsService: listsService,
                                menuService: menu
                            });
                        });
                    });
                };
                get_ctrl([]);
                scope.$digest();
            }));


            it("should populate the breadcrumb", function () {
                expect(menu.breadcrumb.getLast().length).toBe(3);
            });

            it("should not have an edited Todo on start", function () {
                expect(scope.editedTodo).toBeNull();
            });

            it("should not have any Todos on start", function () {
                expect(scope.todos.length).toBe(0);
            });

            it("should have all Todos completed", function () {
                expect(scope.allChecked).toBeTruthy();
            });

            describe("the filter", function () {
                it("should default to ''", function () {
                    scope.$digest();
                    scope.$emit("$routeChangeSuccess");
                    expect(scope.status).toBe("");
                    expect(scope.statusFilter).toEqual({});
                });

                describe("being at /active", function () {
                    it("should filter non-completed", inject(function ($controller) {
                        $controller("TodoCtrl", {
                            $scope: scope,
                            store: store,
                            $routeParams: {
                                status: "active"
                            }
                        });

                        scope.$emit("$routeChangeSuccess");
                        expect(scope.statusFilter.completed).toBeFalsy();
                    }));
                });

                describe("being at /completed", function () {
                    it("should filter completed", inject(function ($controller) {
                        $controller("TodoCtrl", {
                            $scope: scope,
                            $routeParams: {
                                status: "completed"
                            },
                            store: store
                        });

                        scope.$emit("$routeChangeSuccess");
                        expect(scope.statusFilter.completed).toBeTruthy();
                    }));
                });
            });

            describe("having no Todos", function () {

                it("should not add empty Todos", function () {
                    scope.newTodo = "";
                    scope.addTodo();
                    scope.$digest();
                    expect(scope.todos.length).toBe(0);
                });

                it("should not add items consisting only of whitespaces", function () {
                    scope.newTodo = "   ";
                    scope.addTodo();
                    scope.$digest();
                    expect(scope.todos.length).toBe(0);
                });


                it("should trim whitespace from new Todos", function () {
                    scope.newTodo = "  buy some unicorns  ";
                    scope.addTodo();
                    scope.$digest();
                    expect(scope.todos.length).toBe(1);
                    expect(scope.todos[0].title).toBe("buy some unicorns");
                });
            });

            describe("having some saved Todos", function () {

                beforeEach(inject(function () {
                    get_ctrl([
                        {id: 1, title: "Uncompleted Item 0", list_id: 2, completed: false},
                        {id: 2, title: "Uncompleted Item 1", list_id: 2, completed: false},
                        {id: 3, title: "Uncompleted Item 2", list_id: 2, completed: false},
                        {id: 4, title: "Completed Item 0", list_id: 2, completed: true},
                        {id: 5, title: "Completed Item 1", list_id: 2, completed: true}
                    ]);
                    scope.$digest();
                }));

                it("should count Todos correctly", function () {
                    expect(scope.todos.length).toBe(5);
                    expect(scope.remainingCount).toBe(3);
                    expect(scope.completedCount).toBe(2);
                    expect(scope.allChecked).toBeFalsy();
                });

                it("should save Todos to local storage", function () {
                    expect(scope.todos.length).toBe(5);
                });

                it("should remove Todos w/o title on saving", function () {
                    var todo = store.getRecords()[2];
                    scope.editTodo(todo);
                    todo.title = "";
                    scope.saveEdits(todo);
                    scope.$digest();
                    expect(scope.todos.length).toBe(4);
                });

                it("should trim Todos on saving", function () {
                    var todo = store.getRecords()[0];
                    scope.editTodo(todo);
                    todo.title = " buy moar unicorns  ";
                    scope.saveEdits(todo);
                    expect(scope.todos[0].title).toBe("buy moar unicorns");
                });

                it("clearCompletedTodos() should clear completed Todos", function () {
                    scope.clearCompletedTodos();
                    expect(scope.todos.length).toBe(3);
                });

                it("markAll() should mark all Todos completed", function () {
                    scope.markAll(true);
                    scope.$digest();
                    expect(scope.completedCount).toBe(5);
                });

                it("revertTodo() get a Todo to its previous state", function () {
                    var todo = store.getRecords()[0];
                    scope.editTodo(todo);
                    todo.title = "Unicorn sparkly skypuffles.";
                    scope.revertEdits(todo);
                    scope.$digest();
                    expect(scope.todos[0].title).toBe("Uncompleted Item 0");
                });
            });
            describe("having todos on multiple lists", function () {

                beforeEach(inject(function () {
                    get_ctrl([
                        {id: 1, title: "Uncompleted Item 0", list_id: 2, completed: false},
                        {id: 2, title: "Uncompleted Item 1", list_id: 2, completed: false},
                        {id: 3, title: "Uncompleted Item 2", list_id: 1, completed: false}
                    ]);
                    scope.$digest();
                }));

                it("should count Todos only on the current list", function () {
                    expect(scope.todos.length).toBe(2);
                });
            });
        });
    });
}());
