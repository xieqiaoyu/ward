var exports = module.exports = {};

const imports = [
  require('./satisfyJSONschema'),
]

exports.default=imports.reduce((acc, matcher) => ({ ...acc, ...matcher.default }), {});
