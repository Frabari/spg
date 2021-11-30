module.exports = {
  ...require('../.prettierrc.js'),
  importOrderParserPlugins: [
    'typescript',
    'classProperties',
    'decorators-legacy',
  ],
};
