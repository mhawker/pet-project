/*jslint */
/*global define describe it expect beforeEach inject */

/**
 * The unit test for the on-focus behavior
 */
(function () {
    "use strict";
    define([
        "angular",
        "directives/todo-focus",
        "angularMocks"
    ], function (angular, todoFocusDirective) {

        var FILTER_NAME = "todoFocus";

        beforeEach(module('todomvc'));

        describe(FILTER_NAME, function () {

            var scope, compile, browser;

            beforeEach(inject(function ($rootScope, $compile, $browser) {
                scope = $rootScope.$new();
                compile = $compile;
                browser = $browser;
            }));

            it('should focus on truthy expression', function () {
                var el = angular.element('<input todo-focus="focus">');
                scope.focus = false;

                compile(el)(scope);
                expect(browser.deferredFns.length).toBe(0);

                scope.$apply(function () {
                    scope.focus = true;
                });

                expect(browser.deferredFns.length).toBe(1);
            });
        });
    });
}());
