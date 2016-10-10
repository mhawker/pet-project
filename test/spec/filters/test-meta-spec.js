/*jslint */
/*global define describe it expect beforeEach inject */

/**
 * This is a test of a filter that doesn't really do anything; it pretty
 * much just checks that the test framework itself is set up properly.
 *
 * It's the counterpart of filters/test-meta.js
 *
 * See http://monicalent.com/blog/2015/02/11/karma-tests-angular-js-require-j/
 */
(function () {
    "use strict";
    define([
        "angular",
        "filters/test-meta",
        "angularMocks"
    ], function (angular, testMetaFilter) {

        var FILTER_NAME = "testMetaFilter";

        describe(FILTER_NAME, function () {

            beforeEach(angular.mock.module(function ($filterProvider) {
                $filterProvider.register(FILTER_NAME, testMetaFilter);
            }));

            // a test of a test
            it("should not be null", inject(function ($filter) {
                expect($filter(FILTER_NAME)).not.toBeNull();
            }));

            // a real test
            it("should concatenate strings", inject(function ($filter) {
                expect($filter(FILTER_NAME)("a", "b")).toBe("ab");
            }));

        });
    });
}());
