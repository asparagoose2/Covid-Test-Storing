
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
                        }
                    });
                }

                //return response
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
