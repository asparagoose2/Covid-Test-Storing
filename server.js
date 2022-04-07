const express = require("express");
const cors = require('cors');
//require('dotenv').config();
const { serviceRouter } = require("./routers/router");
const path = require('path');
const port = process.env.PORT || 3000;
const app = express();
const fileUpload = require("express-fileupload");
// const originUrl='https://weddinglysystem.netlify.app';

const  corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());
const publicDirectoryPath = path.join(__dirname, './frontend/')
app.use(express.static(publicDirectoryPath))

app.use("/", (req, res, next) => {
    console.log(req.url);
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
    });

app.use('/', serviceRouter);


app.use((req, res) => {
  // res.sendFile(__dirname + '/frontend/index.html');
  res.status(400).send('Something is broken!');
});

app.listen(port, () => console.log((`Express server is running on port ${port}`)));