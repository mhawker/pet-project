var allTestFiles = [
        'angular',
        'angularResource',
        'angularRoute',
        'angularMocks',
]
var TEST_REGEXP = /(spec|test)\.js$/i

Object.keys(window.__karma__.files).forEach(function (file) {
    if (TEST_REGEXP.test(file)) {
        allTestFiles.push(file);
    }
});

require.config({
    baseUrl: '/base/public/app',
    deps: allTestFiles,
    callback: window.__karma__.start,
    paths: {
        require: "/base/test/config/require-shim",
        bootstrap: "/base/test/config/bootstrap",
        domReady: "/base/public/vendor/requirejs-domready/domReady",
        angular: "/base/public/vendor/angular/angular.min",
        angularResource: "/base/public/vendor/angular-resource/angular-resource.min",
        angularRoute: "/base/public/vendor/angular-route/angular-route.min",
        angularMocks: "/base/public/vendor/angular-mocks/angular-mocks"
    },
    shim: {
        angular: {exports: "angular"},
        angularRoute: {deps: ['angular']},
        angularResource: {deps: ['angular']},
        angularMocks: {deps: ['angular']}
    },
});


