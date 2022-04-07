const { Router } = require('express');
const { serviceController } = require('../controllers/serviceController');

const serviceRouter = new Router();

serviceRouter.get('/publicKey' ,serviceController.publicKey);//return public key to client
serviceRouter.post('/covidTestReport' ,serviceController.uploadHandler); //add covid test report

module.exports = { serviceRouter };

