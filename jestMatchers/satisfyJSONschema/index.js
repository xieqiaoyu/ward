const Ajv = require('ajv')

let ajv = new Ajv();

module.exports = {
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
