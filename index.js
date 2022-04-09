const validator = require('./services/validator.service');
const notifier = require('./services/notifier.service');
require('dotenv').config();


if(valid.valid) {
    console.log('valid');
    console.log(valid.errors);
} else {
    console.log('invalid');
    notifier('test.json',valid.errors);    
}