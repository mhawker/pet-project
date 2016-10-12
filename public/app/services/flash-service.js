/*jslint browser for this */
/*global window */

/**
 * Flash messages
 */
(function (define, document) {
    "use strict";

    define(["app"], function (app) {

        /** @var string the id attribute of the breadcrumb */
        var flash_id = "flash-messages";

        var last_flash = {};

        /**
         * Send a flash message
         *
         * @param array the elements, each an object with url and text
         * @return void
         */
        function flash(type, msg) {
            var div = document.createElement("div");
            var btn = document.createElement("button");
            var span = document.createElement("span");
            var flash_container = document.getElementById(flash_id);
            last_flash = {type: type, msg: msg};
            div.className = "alert alert-dismissable alert-" + type;
            div.role = "alert";
            btn.type = "button";
            btn.className = "close";
            btn.dataset.dismiss = "alert";
            btn.innerHTML = "<span aria-hidden='true'>&times;</span>";
            span.innerHTML = msg;
            div.appendChild(btn);
            div.appendChild(span);
            if (flash_container) {
                flash_container.innerHTML = "";
                flash_container.appendChild(div);
            }
        }

        flash.getLast = function () {
            return last_flash;
        };
        // register with angular
        app.factory("flashService", function () {
            return flash;
        });

        // return to requirejs
        return flash;
    });
}(window.define, window.document));
