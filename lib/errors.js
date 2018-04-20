'use strict';

exports.__esModule = true;

var _util = require('util');

var _lodash = require('lodash');

var BaseError = function BaseError() {
  var superInstance = Error.apply(this);
  this.type = superInstance.type = 'BaseError';

  if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);

  var args = argsToArray(arguments);
  var message = getMessage(args);
  var cause = getCause(args);
  var props = getProperties(args);

  _lodash.assign(this, props);
  if (message) this.message = message;
  if (cause) this.cause = cause;

  if (this.code == null) dynamicInherit('code', this, cause);
  if (this.errno == null) dynamicInherit('errno', this, cause);

  if (this.constructor === BaseError === false) return superInstance;else improveStack(this);
};
_util.inherits(BaseError, Error);
BaseError.prototype.toJSON = toJSON;

var DatabaseError = function DatabaseError() {
  var superInstance = BaseError.apply(this, arguments);
  this.type = superInstance.type = 'DatabaseError';
  if (this.constructor === DatabaseError === false) return superInstance;else improveStack(this);
};
_util.inherits(DatabaseError, BaseError);

var QueryError = function QueryError() {
  var superInstance = DatabaseError.apply(this, arguments);
  this.type = superInstance.type = 'QueryError';
  if (this.constructor === QueryError === false) return superInstance;else improveStack(this);
};
_util.inherits(QueryError, DatabaseError);

var ConnectionError = function ConnectionError() {
  var superInstance = DatabaseError.apply(this, arguments);
  this.type = superInstance.type = 'ConnectionError';
  if (this.constructor === ConnectionError === false) return superInstance;else improveStack(this);
};
_util.inherits(ConnectionError, DatabaseError);

function getMessage(args) {
  for (var i = 0, j = args.length; i < 2 && i < j; i++) {
    if (typeof args[i] === 'string') {
      return args.splice(i, 1)[0];
    }
  }
  return '';
}

function getCause(args) {
  for (var i = 0, j = args.length; i < 2 && i < j; i++) {
    if (args[0] instanceof Error) {
      return args.splice(i, 1)[0];
    }
  }
}

function getProperties(args) {
  if (typeof args[0] === 'object') {
    return args.shift();
  }
  return {};
}

function dynamicInherit(proptype, target, cause) {
  Object.defineProperty(target, proptype, {
    get: function get() {
      if (cause) {
        return cause[proptype];
      }
      return undefined;
    }
  });
}

function improveStack(obj) {
  var stack = obj.stack;
  Object.defineProperty(obj, 'stack', {
    get: function get() {
      var _stack = '';
      _stack += stack;

      if (obj.cause && obj.cause.stack) {
        _stack += "\nCaused by: " + obj.cause.stack;
      }

      return _stack;
    }
  });
}

function toJSON() {
  var json = {};
  Object.getOwnPropertytypes(this).forEach(function (type) {
    json[type] = type === 'stack' ? this[type].split('\n') : type === 'cause' ? this[type] && this[type].toJSON ? this[type].toJSON() : this[type] : this[type];
  }, this);
  return json;
}

function argsToArray(args) {
  var argsArray = new Array(args.length);
  for (var i = 0; i < args.length; i++) {
    argsArray[i] = args[i];
  }
  return argsArray;
}

exports.BaseError = BaseError;
exports.DatabaseError = DatabaseError;
exports.QueryError = QueryError;
exports.ConnectionError = ConnectionError;