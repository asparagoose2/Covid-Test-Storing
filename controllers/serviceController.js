const crypto = require('crypto');
const fs = require('fs');
const JSEncrypt = require('node-jsencrypt');
const validator = require('../services/validator.service');
const sendNotification = require('../services/notifier.service');
const uploadFile = require('../services/aws.service');
const jsEncrypt = new JSEncrypt();



const key = jsEncrypt.getKey();
const publicKey = key.getPublicKey();



function contentValidator(fileToCheck) {
    const file = JSON.parse(fileToCheck);
    return {valid: file.valid, errors: file.valid? "" : "File content is not valid"};
}
function hashValidator(file, encryptedFileHash) {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(file);
    const hash = hashSum.digest('hex');
    const decrypted = jsEncrypt.decrypt(encryptedFileHash);
    return {valid: decrypted === hash,
            errors: decrypted !== hash ? 'Hash is not valid' : ""
    };
}

function handleError(fileName, errors) {
    sendNotification(fileName, errors);
}

exports.serviceController = {

    publicKey(req, res) {
        res.json({
            publicKey
        });
    },
    uploadHandler(req, res) {
        try {
            if (!req.files) {
                res.setStatus(400);
                res.send({
                    status: false,
                    message: 'No file uploaded'
                });
            } else {
                //loop all files
                console.log(req.files.reports);
                console.log(req.files.reports.length);
                for (let i = 0; i < req.files.reports.length; i++) {
                    console.log(req.files.reports[i]);
                    //get file
                    let file = req.files.reports[i];
                    //get file name
                    let fileName = file.name;
                    file.mv(`${process.cwd()}/filesUploads/${fileName}`, function (err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            const fileToCheck = fs.readFileSync(`${process.cwd()}/filesUploads/${fileName}`, 'utf8');
                            const isHashValid = hashValidator(fileToCheck, req.body["file" + i]);
                            const isStructureValid = validator(fileName, fileToCheck);
                            const isContentValid = contentValidator(fileToCheck);

                            const isFileValid = isHashValid.valid && isStructureValid.valid && isContentValid.valid

                            uploadFile(fileName, isFileValid)
                            
                            if (!isFileValid) {
                                let errors = "";
                                if (!isHashValid.valid) {
                                    errors += isHashValid.errors + "\n";
                                }
                                if (!isStructureValid.valid) {
                                    errors += isStructureValid.errors + "\n";
                                }
                                if (!isContentValid.valid) {
                                    errors += isContentValid.errors + "\n";
                                }
                                handleError(fileName, errors);
                            }
                        }
                    });
                }

                res.json({
                    status: true,
                    message: req.files.reports.length + ' file(s) were uploaded successfully'
                });
                
            }

        } catch (err) {
            res.status(500).send(err);
        }
    }
}
