
exports.serviceController = {

    publicKey(req, res) {
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
        
        app.post('/', async (req, res) => {
            try {
                if(!req.files) {
                    res.send({
                        status: false,
                        message: 'No file uploaded'
                    });
                } else {
                    let data = []; 
            
                    //loop all files
                    _.forEach(_.keysIn(req.files.file), (key) => {
                        let file = req.files.file[key];
                        
                        //move photo to uploads directory
                        file.mv('./filesUploads/' + file.name);
        
                        
                    });
            
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
        });
   
   
}
}
