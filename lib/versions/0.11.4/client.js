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

      var _orig$acquireConnection$apply = orig.acquireConnection.apply(this, arguments);

      var completed = _orig$acquireConnection$apply.completed;
      var abort = _orig$acquireConnection$apply.abort;

      return {
        completed: completed['catch'](function (err) {
          if (_this._convertError) {
            err = client._convertError(err);
          }
          throw err;
        }),
        abort: abort
      };
    }
  };

  orig = _lodash.pick(origClient, Object.keys(overrides));

  return overrides;
};

module.exports = exports['default'];