'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports.default = function (_ref) {
  var t = _ref.types;
  var fileName = '';

  return {
    visitor: {
      MemberExpression: function(path, state) {
        if (path.get('object').container.object.name === 'exports') {
          var fileName = state.file.opts.filename;
          fileName = fileName.split('/');
          fileName = fileName.pop().replace('.js', '');
          path.replaceWithSourceString('inject.' + fileName + 'Filter');
        }
      },
      CallExpression: function CallExpression(path) {
        var test = path.get('callee').get('callee').container.object;

        if ((test && test.name && test.name === 'config') || (path.get('callee').node.name === 'config')) {
          var configName = path.node.arguments[0].value;
          var configValue = config.get(configName);
          configValue = JSON.stringify(configValue);

          path.replaceWithSourceString(configValue);
        } else if (path.get('callee').node.name === 'require') {
          path.remove();
        }
      },
      VariableDeclarator: function(path) {
        if (path.get('id').container.id.name === 'table') {
          path.replaceWithSourceString(' table = []');
        }
      }
    }
  };
};

var _babelTypes = require('babel-types');

var t = _interopRequireWildcard(_babelTypes);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var config = require('../config');