/*jslint browser for this */
/*global window */

/**
 * Add/Remove links to the top menu
 */
(function (define, document) {
    "use strict";

    define([
        "app"
    ], function (app) {

        /** @var string the id attribute of the breadcrumb */
        var breadcrumb_id = "site-breadcrumb";

        /**
         * Remove the 'hidden' bootstrap class from an element. Avoids having to
         * call in jqlite.
         *
         * @param DOMElement the element to show
         */
        function show(element) {
            var classes = element.className.split(" ");
            var hidx = classes.indexOf("hidden");
            if (hidx > -1) {
                classes.splice(hidx, 1);
                element.className = classes.join(" ");
            }
        }

        /**
         * Add the 'hidden' bootstrap class from an element. Avoids having to
         * call in jqlite.
         *
         * @param DOMElement the element to hide
         */
        function hide(element) {
            var classes = element.className.split(" ");
            var hidx = classes.indexOf("hidden");
            if (hidx < 0) {
                classes.push("hidden");
                element.className = classes.join(" ");
            }
        }

        /**
         * Set the content of the breadcrumbs
         *
         * @param array the elements, each an object with url and text
         * @return void
         */
        function breadcrumb(links) {
            var bc = document.getElementById(breadcrumb_id);
            while (bc.firstChild) {
                bc.removeChild(bc.firstChild);
            }
            if (links.length === 0) {
                hide(bc);
                return;
            }
            var li;
            var a;
            links.map(function (link) {
                li = document.createElement("li");
                a = document.createElement("a");
                a.href = "#" + link.url;
                a.text = link.text;
                li.appendChild(a);
                bc.appendChild(li);
            });
            li.className = "active";
            li.innerHTML = a.text;
            show(bc);
        }

        /** @var object the module */
        var service = {
            breadcrumb: breadcrumb
        };

        // register with angular
        app.factory("menuService", function () {
            return service;
        });

        // return to requirejs
        return service;
    });
}(window.define, window.document));
