const Validator = require('jsonschema').Validator;
const validator = new Validator();
const fs = require('fs');
const testResultSchema = JSON.parse(fs.readFileSync('./testResultSchema.json', 'utf8'));


const testResult = {
    "name": "test",
    "result": true,
    "timeStamp": Date.now()
};

const valid = validator.validate(testResult, testResultSchema);

if(!valid.valid) {
    valid.errors.forEach(error => {
        console.log(error.stack);
    });
} else {
    console.log("file is valid");
}