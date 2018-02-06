'use strict';

exports.__esModule = true;
exports.attach = attach;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

var _errors = require('./errors');

var errors = _interopRequireWildcard(_errors);

var _lodash = require('lodash');

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

exports.Errors = errors;

function attach(Knex, handler) {
  Knex.Errors = errors;

  var knex = handler();
  knex.errors = errors;

  var client = knex.client;

  var dialectName = client.dialect;

  var versions = _fs2['default'].readdirSync(_path2['default'].join(__dirname, './versions'));

  var _versions$sort$reverse$filter = versions.sort().reverse().filter(function (version) {
    return _semver2['default'].satisfies(knex.VERSION, '^' + version);
  });

  var version = _versions$sort$reverse$filter[0];

  if (!version) {
    throw new Error('knex@' + knex.VERSION + ' is not supported');
  }
  var clientOverrider = require('./versions/' + version + '/client');

  try {
    var dialectOverrider = require('./dialects//' + dialectName);

    _lodash.assign(client, clientOverrider(client), dialectOverrider(client));
  } catch (err) {
    console.warn("knex-generic-errors not implemented for dialect: " + dialectName);
  }

  return knex;
}