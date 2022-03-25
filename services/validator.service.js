const Validator = require('jsonschema').Validator;
const validator = new Validator();
const fs = require('fs');
const testResultSchema = JSON.parse(fs.readFileSync('./testResultSchema.json', 'utf8'));
const cwd = process.cwd();


const fileValidator = function(fileName) {
    const fileExtension = fileName.split('.').pop();
    if(fileExtension !== 'json') {
        return false;
    }
    try {
        const filePath = cwd + '/test-files/' + fileName;
        const testResultFile = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        const valid = validator.validate(testResultFile, testResultSchema);
        return valid.valid;
    } catch(e) {
        console.log('file is not valid');
        console.log(e);
        return false;
    }
}

module.exports = fileValidator;