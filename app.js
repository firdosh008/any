require("dotenv").config();
const express = require("express");
require("./database/connection");
const defaultData = require("./defaultdata");
const app= express();
const cors = require("cors");
const router = require("./routes/router");
const cookieParser = require("cookie-parser");



app.use(express.static("build"));

app.use(express.json());
app.use(cookieParser(""));
app.use(cors({
    origin: ['http://localhost:3000', 'https://anymart-backend.vercel.app/'],
    credentials: true
  }));
app.use(router);



const port=process.env.PORT || 8000;

app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});


defaultData();

