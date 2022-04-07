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

// const key = new NodeRSA({b: 512});

console.log(key.exportKey());

exports.serviceController = {

    publicKey(req, res) {
        res.json({
            publicKey: process.env.PUBLIC_KEY || "publicKey"
        });
        // this.publicKey.findById(req.params.id)
        //     .then((result) => {
        //         if (result) {
        //             res.json(result);
        //         }
        //     })
        //     .catch((err) => {
        //         res.status(404).json({ message: `Can't find customer by id!` });
        //     })
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
                for(let i = 0; i < req.files.reports.length; i++) {
                    //get file
                    let file = req.files.reports[i];
                    //get file name
                    let fileName = file.name;
                    file.mv(`${process.cwd()}/filesUploads/${fileName}`, function(err) {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            let rawdata = fs.readFileSync(`${process.cwd()}/filesUploads/${fileName}`, 'utf8');
                            const hashSum = crypto.createHash('sha256');
                            hashSum.update(rawdata);
                            const hex = hashSum.digest('hex');
                            const decrypted = jsEncrypt.decrypt(req.body["file"+i]);
                            if(decrypted === hex) {
                                data.push({
                                    fileName: fileName,
                                    filePath: `${process.cwd()}/filesUploads/${fileName}`,
                                    fileHash: hex
                                });
                            } else {
                                
                                res.status(500).send({
                                    status: false,
                                    message: 'File is not valid!'
                                });
                            }
                            console.log(decrypted == hex);

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
