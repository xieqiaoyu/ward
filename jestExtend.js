const matchers = require('./jestMatchers')
const jestExpect = global.expect;

if (jestExpect !== undefined) {
  jestExpect.extend(matchers.default);
} else {
  console.error(
    "Unable to find Jest's global expect."
  );
}
