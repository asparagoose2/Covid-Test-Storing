const crypto = require('crypto');
const fs = require('fs');
const NodeRSA = require('node-rsa');
const JSEncrypt = require('node-jsencrypt');

const jsEncrypt = new JSEncrypt();


const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIICXQIBAAKBgQDlOJu6TyygqxfWT7eLtGDwajtNFOb9I5XRb6khyfD1Yt3YiCgQ
WMNW649887VGJiGr/L5i2osbl8C9+WJTeucF+S76xFxdU6jE0NQ+Z+zEdhUTooNR
aY5nZiu5PgDB0ED/ZKBUSLKL7eibMxZtMlUDHjm4gwQco1KRMDSmXSMkDwIDAQAB
AoGAfY9LpnuWK5Bs50UVep5c93SJdUi82u7yMx4iHFMc/Z2hfenfYEzu+57fI4fv
xTQ//5DbzRR/XKb8ulNv6+CHyPF31xk7YOBfkGI8qjLoq06V+FyBfDSwL8KbLyeH
m7KUZnLNQbk8yGLzB3iYKkRHlmUanQGaNMIJziWOkN+N9dECQQD0ONYRNZeuM8zd
8XJTSdcIX4a3gy3GGCJxOzv16XHxD03GW6UNLmfPwenKu+cdrQeaqEixrCejXdAF
z/7+BSMpAkEA8EaSOeP5Xr3ZrbiKzi6TGMwHMvC7HdJxaBJbVRfApFrE0/mPwmP5
rN7QwjrMY+0+AbXcm8mRQyQ1+IGEembsdwJBAN6az8Rv7QnD/YBvi52POIlRSSIM
V7SwWvSK4WSMnGb1ZBbhgdg57DXaspcwHsFV7hByQ5BvMtIduHcT14ECfcECQATe
aTgjFnqE/lQ22Rk0eGaYO80cc643BXVGafNfd9fcvwBMnk0iGX0XRsOozVt5Azil
psLBYuApa66NcVHJpCECQQDTjI2AQhFc1yRnCU/YgDnSpJVm1nASoRUnU8Jfm3Oz
uku7JUXcVpt08DFSceCEX9unCuMcT72rAQlLpdZir876
-----END RSA PRIVATE KEY-----`


jsEncrypt.setPrivateKey(privateKey);

const key = new NodeRSA(privateKey);

function contentValidator(fileToCheck) {
    const file = JSON.parse(fileToCheck);
    return file.valid;
}
function isHashValid(file, encryptedFileHash) {
    const hashSum = crypto.createHash('sha256');
    hashSum.update(file);
    const hash = hashSum.digest('hex');
    const decrypted = jsEncrypt.decrypt(encryptedFileHash);
    return decrypted === hash;
}

function handleError(fileName, errors) {
    sendNotification(fileName, errors);
}

exports.serviceController = {

    publicKey(req, res) {
        res.json({
            publicKey: process.env.PUBLIC_KEY || "publicKey"
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
                let data = [];
                console.log(req.body);
                //loop all files
                for (let i = 0; i < req.files.reports.length; i++) {
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
                            const isHashValid = isHashValid(fileToCheck, req.body["file" + i]);
                            const isStructureValid = validator(fileName, fileToCheck);
                            const isContentValid = contentValidator(fileToCheck);

                            const isFileValid = isHashValid.valid && isStructureValid.valid && isContentValid.valid

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

                            uploadFile(fileName, isFileValid)
                        }
                    });
                }

                res.send({
                    status: true,
                    message: 'Files are uploaded',
                    data: data
                });
            }

        } catch (err) {
            res.status(500).send(err);
        }
    }
}
