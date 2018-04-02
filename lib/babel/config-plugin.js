var config = require('../config');

'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

exports.default = function() {
  return {
    visitor: {
      MemberExpression: function MemberExpression(path, state) {
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
      AssignmentExpression: function AssignmentExpression(path) {
        var right = path.get('expression').container.right;
        if (right.type === 'NewExpression' && right.callee.name === 'Table') {
          path.remove();
        }
      },
      VariableDeclarator: function VariableDeclarator(path) {
        if (path.get('id').container.id.name === 'table') {
          path.replaceWithSourceString(' table = []');
        }
      }
    }
  };
};
