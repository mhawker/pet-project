/*jslint browser for this */
/*global window */

/**
 * A skeleton of a CRUD model
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app",
        "./resource-creator"
    ], function (angular, app) {

        /**
         * A basic CRUD model, can be extended after creation
         *
         * @constructor
         * @param string model name the name of the model
         * @param object model_schema the schema for the model
         * @param object api the API, as returned by resource-creator.js
         */
        var Model = function (model_name, model_schema, api) {

            var that = this;

            /** @var array a local copy of what's been retrieved from the API for binding */
            var records = [];

            /** @var object parameters to force on operations */
            var forced_params = {};

            /**
             * Get the model name
             *
             * @return string
             */
            this.getName = function () {
                return model_name;
            };

            /**
             * Get the model schema
             *
             * @return object
             */
            this.getSchema = function () {
                return model_schema;
            };

            /**
             * Get the underlying $resource API
             *
             * @return object
             */
            this.getApi = function () {
                return api;
            };


            /**
             * Get the currently retreived recordset
             *
             * @return array
             */
            this.getRecords = function () {
                return records;
            };


            /**
             * The C in CRUD
             *
             * @param object record the record to create
             *
             * @return promise, will get the saved record
             */
            this.create = function (record) {
                var original = records.slice(0);
                var keys = Object.keys(model_schema);
                var i;
                for (i = 0; i < keys.length; i += 1) {
                    if (record[keys[i]] === undefined) {
                        record[keys[i]] = model_schema[keys[i]];
                    }
                }
                angular.extend(record, forced_params);
                records.push(record);
                return api.save(record, function (response) {
                    record.id = response.id;
                }, function () {
                    angular.copy(original, records);
                });
            };

            /**
             * The R in CRUD
             *
             * @param object where the where parameters
             *
             * @return promise, will get the matching records in an array
             */
            this.read = function (where) {
                where = angular.extend(where || {}, forced_params);
                // TODO: is this the right syntax?
                return api.query(where, function (response) {
                    angular.copy(response, records);
                });
            };

            /**
             * The U in CRUD
             *
             * @param object record the record to update, with changes made
             *
             * @return promise will have 1 in the record was changed, or 0
             */
            this.update = function (record) {
                angular.extend(record, forced_params);
                // TODO: is the dollar sign necessary?
                return api.update({id: record.id}, record).$promise;
            };

            /**
             * The D in CRUD
             *
             * @param object record the record to delete
             *
             * @return promise will have 1 in the record was deleted, or 0
             */
            this.delete = function (record) {
                var original = records.slice(0);
                records.splice(records.indexOf(record), 1);
                return api.delete({id: record.id}, function () {
                    return undefined;
                }, function () {
                    angular.copy(original, records);
                });
            };

            /**
             * Force parameters on all records in the set, for all operations.
             * Useful for enforcing foreign keys when viewing individual
             * records.
             *
             * @param object the parameters to force, in key:value format
             */
            this.force_params = function (params) {
                forced_params = angular.extend(forced_params, params);
            };

            this.force_values = function (values) {
                api.forceValues(values);
                return that.read();
            };

        };

        // NOTE: as this module depends on $q and resourceCreator, it cannot be
        // directly returned to RequireJS
        return app.factory("modelCreator", function ($q, resourceCreator) {
            return function (model_name, model_schema) {
                var deferred = $q.defer();
                resourceCreator.getResource().then(function (create_resource) {
                    var model = new Model(model_name, model_schema, create_resource(model_name));
                    deferred.resolve(model);
                });
                return deferred.promise;
            };
        });
    });
}(window.define));
