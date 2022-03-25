const validator = require('./services/validator.service');


const valid = validator('test.json');

if(valid) {
    console.log('valid');
} else {
    console.log('invalid');
}