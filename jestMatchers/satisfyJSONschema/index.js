const Ajv = require('ajv')

var exports = module.exports = {};
let ajv = new Ajv();

exports.default = {
  satisfyJSONschema:(received,schema) => {
    let validate = ajv.compile(schema);
    let pass=validate(received);
    if (pass) {
      return {
        message:() =>
          `expected satisfy JSONschema`,
        pass: true,
      }
    } else {
      let errMsg = ajv.errorsText(validate.errors)
      return {
        message:() => `${JSON.stringify(received)} verify Err : ${errMsg}`,
        pass: false,
      }
    }
  }
};
