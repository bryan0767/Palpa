'use strict';

const express = require('express')
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const mongodb = require('mongodb')
const body = require('body-parser')
const nodeMailer = require('nodemailer');

mongoose.connect(process.env.DB)

app.use(body.json())
app.use(body.urlencoded({extended:false}));

app.use("/src", express.static(__dirname + '/public'));

app.route('/').get(function(req,res) {
      res.sendFile(process.cwd() + '/views/index.html')
  })

app.route('/confirm').get(function(req,res) {
        res.sendFile(process.cwd() + '/views/confirm.html')
    })

let email = mongoose.Schema({
  email:String,
})

let Email = mongoose.model('Email',email)

app.route('/api/home').get(function(req,res,done) {
  res.redirect('/')
  })

app.route('/api/shows').post(function(req,res,done) {
  let mail = new Email({
    email:req.body.signup
    })

    mail.save(function(err, data) {
      if(err) done(err)
      res.redirect('/confirm')
    })
  })

app.route('/api/donuts').post(function(req, res, done) {
  let transporter = nodeMailer.createTransport({
    service:"hotmail",
    auth: {
      user:"bryan224@live.com",
      pass: "leon1234"
    }
  });
  let mailOptions = {
    from:'${req.body.email}',
    to: 'bryan224@live.com',
    subject:'From Your Devoted Fans',
    text:'this is a test' + req.body.name + req.body.email + req.body.text,
    html:'<p><ol><ul>name: ' + req.body.name + '</ul><ul> Email: '+ req.body.email +'</ul><ul>Message: '+ req.body.text +'</ul></ol>',
  }

  transporter.sendMail(mailOptions, function(err, info) {
    if(err) {
      console.log(err);
      res.redirect('/')
    } else {
      console.log("message sent");
      res.redirect('/confirm')
    }
  })
});

app.listen(port, function() {
  console.log('yo momma boiii')
})

// }

// - react will run on port 3000, make sure it receives this port from proxy
