/*jslint browser for this */
/*global window */

/**
 * Add/Remove links to the top menu
 */
(function (define) {
    "use strict";

    define([
        "angular"
    ], function (angular) {

        return {
            add: function (id, url, text) {
                id = "menu-" + id;
                if (document.getElementById(id)) {
                    return;
                }
                var a = document.createElement('a');
                a.href = '#' + url;
                a.id = id;
                a.text = text;
                document.getElementById('site-nav').appendChild(a);
            },
            del: function (id) {
                id = "menu-" + id;
                var a = document.getElementById(id);
                if (a) {
                    a.parentNode.removeChild(a);
                }
            }
        };
    });
}(window.define));
