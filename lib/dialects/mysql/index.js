'use strict';

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _errors = require('./errors');

var errorPredicates = _interopRequireWildcard(_errors);

var _errors2 = require('../../errors');

var _lodash = require('lodash');

exports['default'] = function () {
  return {
    _convertError: function convertError(err, callback) {
      if (errorPredicates.ConnectionError(err)) {
        err = new _errors2.ConnectionError('Could not connect to the database', err);
      } else if (errorPredicates.MysqlProtocolError(err) || errorPredicates.NetworkError(err)) {
        err = new _errors2.ConnectionError('Database connection dropped', err);
      }

      if (_lodash.isFunction(callback)) {
        return callback(err);
      }
      return err;
    }
  };
};

module.exports = exports['default'];