const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const ConnectDB =require('./dataBase/db');
const router = require('./routes/userRoute');
const app = express();
const PORT=3000;



//middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


//database
ConnectDB();


//routes
app.use("/api/user",router)


app.listen(PORT,()=>console.log(`server is running on PORT${PORT}`))