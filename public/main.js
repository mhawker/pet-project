/*jslint browser */
/*global window */

/**
 * Application entry point, called directly by requirejs
 */
(function (require) {
    "use strict";
    require.config({
        
        paths: {
            domReady: "/vendor/requirejs-domready/domReady",
            angular: "/vendor/angular/angular.min",
            angularResource: "/vendor/angular-resource/angular-resource.min",
            angularRoute: "/vendor/angular-route/angular-route.min",
            app: "app/app"
        },
        shim: {
            angular: {exports: "angular"},
            angularRoute: {deps: ["angular"]},
            angularResource: {deps: ["angular"]}
        },
        deps: ["/app/bootstrap.js"]
    });
}(window.require));
