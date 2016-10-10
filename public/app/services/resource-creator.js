/*jslint browser for this */
/*global window */

/**
 * Wrap the $resource service in a decorator that will provide the Query/CRUD
 * methods even if the backend is not responding (eg, dev environment) by
 * leveraging localStore.
 */
(function (define) {
    "use strict";
    define([
        "angular",
        "app"
    ], function (angular, app) {

        return app.factory("resourceCreator", function ($http, $resource, $q) {

            return $http.get("/api").then(function () {
                return function (model_name) {
                    var resource = $resource("/api/" + model_name + "/:id", null, {
                        update: {method: "PUT"}
                    });
                    return {
                        save: resource.save,
                        query: resource.query,
                        update: resource.update,
                        delete: resource.delete
                    };
                };
            }, function () {
                return function (model_name) {

                    /** @var string the key for the table in local storage */
                    var skey = "TODOMVC." + model_name;

                    /**
                     * Get the entire table from local storage
                     *
                     * @param array data
                     * @return void
                     */
                    function fetch() {
                        return JSON.parse(localStorage.getItem(skey) || "[]");
                    }

                    /**
                     * Persist the entire table to the local storage object
                     *
                     * @param array data
                     * @return void
                     */
                    function persist(data) {
                        localStorage.setItem(skey, JSON.stringify(data));
                    }

                    /**
                     * Wrap a callable in a decorator that returns a promise to simulate
                     * async behavior
                     *
                     * @param callable fn the callable to decorate
                     *
                     * @return callable the decorated callable
                     */
                    function faux_promise(resolve, success) {
                        var deferred = $q.defer();
                        deferred.resolve(resolve);
                        if (success) {
                            deferred.promise.then(success);
                        }
                        // TODO: see model-creator.js Model.update()
                        deferred.promise.$promise = deferred.promise;
                        return deferred.promise;
                    }

                    /**
                     * Get the next auto increment value for the table
                     *
                     * @return integer
                     */
                    var auto_increment = (function () {
                        var data = fetch();
                        var auto_inc = 0;
                        var i;
                        for (i = 0; i < data.length; i += 1) {
                            auto_inc = Math.max(data[i].id, auto_inc);
                        }
                        return function () {
                            auto_inc += 1;
                            return auto_inc;
                        };
                    }());

                    /**
                     * Compare a record against criteria to see if they match
                     *
                     * @param object record the record to check
                     * @param object where the criteria to check against
                     *
                     * @return bool true if match, or false
                     */
                    function is_record_match(record, where) {
                        var keys = Object.keys(where || {});
                        var i;
                        // note: should be replaced with .forEach when
                        // browser support is better.
                        for (i = 0; i < keys.length; i += 1) {
                            if (record[keys[i]] !== where[keys[i]]) {
                                return false;
                            }
                        }
                        return true;
                    }

                    /**
                     * Save a new record to the record table
                     *
                     * @param object record the object to save
                     * @param object the object as saved
                     */
                    function save(record) {
                        var records = fetch();
                        record.id = auto_increment();
                        records.push(record);
                        persist(records);
                        return record;
                    }

                    /**
                     * Read an arbitrary number of records from the database
                     *
                     * @param object where the columns to match
                     * @return array the matched records
                     */
                    function query(where) {
                        var records = fetch();
                        return records.filter(function (record) {
                            return is_record_match(record, where);
                        });
                    }

                    /**
                     * Update a record
                     *
                     * @param object where the columns to match for update
                     * @param object chages the changes to make
                     *
                     * @return integer changed rows
                     */
                    function update(where, changes) {
                        var records = fetch();
                        var changed = 0;
                        var i;
                        for (i = 0; i < records.length; i += 1) {
                            if (is_record_match(records[i], where)) {
                                changed += 1;
                                records[i] = angular.extend(records[i], changes);
                            }
                        }
                        persist(records);
                        return changed;
                    }

                    /**
                     * Delete a record from the table
                     *
                     * @param object where the criteria for records to delete
                     *
                     * @return integer the number of deleted rows
                     */
                    function del(where) {
                        var records = fetch();
                        var resave = [];
                        var changed = 0;
                        var i;
                        for (i = 0; i < records.length; i += 1) {
                            if (is_record_match(records[i], where)) {
                                changed += 1;
                            } else {
                                resave.push(records[i]);
                            }
                        }
                        persist(resave);
                        return changed;
                    }

                    // the return is a map of the CRUD functions wrapped in
                    // promises
                    return {
                        save: function (record, success) {
                            return faux_promise(save(record), success);
                        },
                        query: function (where, success) {
                            return faux_promise(query(where), success);
                        },
                        update: function (where, values, success) {
                            return faux_promise(update(where, values), success);
                        },
                        delete: function (where, success) {
                            return faux_promise(del(where, success));
                        }
                    };
                };
            });
        });
    });
}(window.define));
