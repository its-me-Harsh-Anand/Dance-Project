const express = require("express");
const fs = require('fs');
const app= express()
const path = require('path')
const bodyparser = require("body-parser")


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/DanceContact', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("Node.js and Mongo is finally connected.")
});


var contactSchema = new mongoose.Schema({   
    name: String,
    phone: String,
    age: String,
    email: String,
    address: String,
    description: String
});

const Contact = mongoose.model("Contact", contactSchema);




//setting express stuff
app.use('/static',express.static('static'))
app.use(express.urlencoded()) //must use this to save data to mongod database

//Setting PUG Stuff
app.set('view engine',"pug");
app.set('views',path.join(__dirname,"views")); 

//Endpoint
app.get('/',(req,res)=>{
    const params = {'title':"Welcome to Harsh Dance Academy"}
    res.status(200).render('home.pug', params)
})
app.get('/about',(req,res)=>{
    const params = {'title':"About us"}
    res.status(200).render('about.pug', params)
})
app.get('/contact',(req,res)=>{
    const params = {'title':"Contact form"}
    res.status(200).render('contact.pug', params)
})
app.get('*',(req,res)=>{
    const params = {'title':"404 error"}
    res.status(200).render('error.pug', params)
})
app.post('/contact',(req,res)=>{
    var myData = new Contact(req.body);
    myData.save().then(()=>{
        res.render('home.pug')
    }).catch(()=>{
        res.status(400).send("Oops!, something went wrong...Pls fill the form again.")
    });
})
// app.get('/',(req,res)=>{
//     res.status(200).send('This is my homepage...:)')
// })


const hostname='127.0.0.1'
const port= process.env.PORT || 80
app.listen(port, (req,res)=>{
    console.log(`App is running on http://${hostname}:${port}`)
})
