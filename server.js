const express = require("express");
const cors = require('cors');
const cookieParser = require('cookie-parser');
//require('dotenv').config();
const { customersRouter } = require("./routers/customersRouter");

const port = process.env.PORT || 3200;
const app = express();
// const originUrl='https://weddinglysystem.netlify.app';

app.use(cookieParser());
const corsOptions = {
origin:originUrl,
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Weddingly application." });
});

app.use('/weddingly/auth', authRouter);
app.use('/weddingly/customers', customersRouter);

app.use('/weddingly/suppliers', suppliersRouter);

app.use('/weddingly/ratings', ratingsRouter);

app.use((req, res) => {
  res.status(400).send('Something is broken!');
});

app.listen(port, () => console.log((`Express server is running on port ${port}`)));