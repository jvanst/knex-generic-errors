'use strict';

exports.__esModule = true;

var _errors = require('../../errors');

var _lodash = require('lodash');

exports['default'] = function (origClient) {
  var orig = undefined;
  var overrides = {
    query: function query(connection, obj) {
      var client = this;
      return orig.query.apply(this, arguments)['catch'](function (err) {
        if (client._convertError) {
          err = client._convertError(err);
        }
        err = new _errors.QueryError(err.message, err, { sql: obj.sql, bindings: obj.bindings });
        throw err;
      });
    },

    acquireConnection: function acquireConnection() {
      var _this = this;

      var client = this;

      var origAcquireConnection = orig.acquireConnection.apply(this, arguments);

      return origAcquireConnection['catch'](function (err) {
        if (_this._convertError) {
          err = client._convertError(err);
        }
        throw err;
      });
    }
  };

  orig = _lodash.pick(origClient, Object.keys(overrides));

  return overrides;
};

module.exports = exports['default'];