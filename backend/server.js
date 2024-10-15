require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors =require('cors');
const path = require('path');
const port = process.env.PORT || 3000;
const mongourl = process.env.MONGOURL;
const route = require('./routes/routes');

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());

// mongo db conncetion
mongoose.connect(mongourl,{
    useNewUrlParser: true,
    useUnifiedTopology: true,})
    .then(()=>{
        console.log('MongoDB Connected successfully');
    })
    .catch((error)=>{
        console.log('MongoDB Connection failed'+error);
    })

// routes

app.use('/ems',route);


// server port
app.listen(port, () => {
   console.log(`Server running on ${port}`);
});
