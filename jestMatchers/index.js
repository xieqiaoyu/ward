const imports = [
  require('./satisfyJSONschema'),
]

module.exports=imports.reduce((acc, matcher) => ({ ...acc, ...matcher}), {});
