const express=require('express');
const { check, validationResult } = require('express-validator');
// const session = require('express-session');

const mongoose = require('mongoose')
const NGOUser = require('../models/ngouser')
const Refugeerequest = require('../models/req')
const Refugee = require('../models/refugee')
const RefugeeUser = require('../models/refugee')
const PatronUser = require('../models/patron')
const patronOffer = require('../models/patronoffer.js.js')
// const request = require('../models/req')

const router = express.Router();
const bodyparser=require('body-parser');
var nodemailer = require('nodemailer');
const { findById } = require('../models/ngouser');
const wellKnown = require('nodemailer/lib/well-known');
<<<<<<< HEAD
const PatronOffer = require('../models/patronoffer.js');
const { request } = require('http');
=======
const { response } = require('express');
>>>>>>> 5c91dcaaa118324f075cc6a2c9295143621c6e51
var urlencodedparser=bodyparser.urlencoded({extended:false});
bodyParser = require('body-parser').json();

ngouser_id = '622d5aa13b43b65219d17e80'

router.get('/hello',(req,res)=>{
    res.render('helloworld.ejs')
  });

    // When the New Refugee form is visited
    router.get('/refugeeForm',(req,res)=>{
      res.render('refugeeFormTemplate.ejs')
    });


  // When the SUBMIT button on the new refugee form is hit.
    router.post('/refugeeForm', (req, res)=>{
    let newRefugeeUser = new RefugeeUser({

        firstname: req.body.firstname,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.age,
        govID: req.body.govID,
        phone_number: req.body.phone_number,
        email: req.body.email,
        home_address:{ street: req.body.street,
        locality: req.body.locality, city: req.body.city, zip: req.body.zip}

    })

        newRefugeeUser.save()
        .then(res.redirect('/ngo_view'))
    })


    // When the Patron form is visited
    router.get('/patronForm',(req,res)=>{
        res.render('patronForm.ejs')
      });

      router.get('/refugeeRequestForm',(req,res)=>{
          res.render('refugeeRequestForm.ejs')
        });

    // When the SUBMIT button on the new Patron form is hit.
    router.post('/patronForm',(req,res)=>{
    let newPatronUser = new PatronUser({
        name: req.body.firstname + req.body.lastname,
        phone_number: req.body.phone_number,
        email: req.body.email,
        address: req.body.street + " "
        + req.body.locality + " " +
        req.body.city + " " + req.body.zip,
        password: "Patron@1234"

      })

        newPatronUser.save()
        .then(res.redirect('/ngo_view'))
    })


router.get('/ngo_view',(req,res)=>{
  Refugeerequest.find({NgoId : new mongoose.Types.ObjectId(ngouser_id)}).lean().then(async (requests)=>{
      for (let  i = 0; i < requests.length;i++){
        const each_names = [];
        requests[i].names = [];
        for(let j = 0; j < requests[i].refugees.length;j++){
          var string_id  = String((requests[i].refugees[j]).valueOf())
          await Refugee.findById(string_id).then((res)=>{
          each_names.push(res.firstname.concat(" ",res.lastname))
          })
        }
        requests[i].names = each_names
        const date1 = new Date(requests[i].time);
        const date2 = new Date();
        if (date2 < date1) {
            date2.setDate(date2.getDate() + 1);
        }
        
        var diff = date2 - date1;
        var msec = diff;
        var hh = Math.floor(msec / 1000 / 60 / 60);        
        requests[i].time = hh;
      }
      res.render( 'ngo.view.ejs' , { refugee_requests : requests} )
  })
})


router.post('/getPatrons',(req,res)=>{
    // console.log(Number(req.body.totalPeople))
    patronOffer.find({noPeople:{ $eq: Number(req.body.totalPeople) }}).lean().then(async (response)=>{
        console.log("lol")
        for (var i = 0;i < response.length;i++){
            await PatronUser.findOne({"id":new mongoose.Types.ObjectId(response[i].patronID)}).then((res1)=>{
                response[i].name = res1.name;
            })
        }
        console.log(response)
        res.json({"patrons":response})
    })
    // console.log("lol")
    // console.log(response)
    
})

router.post('/getPatronDetails',(req,res)=>{
  const Id  = req.body.Id;
  PatronOffer.find({_id : Id}).lean().then(async (offer_details) => {
    await PatronUser.findById(offer_details.patronID).then((patron_details)=>{
      offer_details.name = patron_details.name;
      offer_details.phone_number = patron_details.phone_number;
      offer_details.email = patron_details.email;
    })
    res.json({"patron_details" : patron_details})
  })
})

router.get('/findPeople',(req,res)=>{

    res.render('findPeople.ejs',{"matching_data" : ['koushik','dsk','sashank']})
})





// When the SUBMIT button on the new refugee form is hit.
router.post('/addNewRefugee', (req, res)=>{
    console.log(req.body)
})

router.get('/newRefugeeForm', (req,res)=>{
    res.render('ngo.view.ejs',{"refugee_requests" : 5})
})


//Manually add new GMU.
router.get('/addNewNGO',(req,res)=>{
    let newNGOUser = new NGOUser({
        name: 'WeLovePeace',
        phone_number: 9889889889,
        email: 'welovepeace@go.com',
        password: 'hi@1234',
        address:{ street: 'Shein Kutler Road',
        locality: 'Meine glucklish', city: 'Berlin', zip: '120728'}
})
    newNGOUser.save()
.then(console.log("SAVED!"))
  });

// END OF ADD NEW NGO.

router.post('/getRefugees', (req, res)=> {
      res.json({'data':[{
        firstname: "Mac",
        lastname: "Harris",
      },
    {
      firstname: "John",
      lastname: "Harris",
    }]})
  });

  // When the New Refugee form is visited
  router.get('/patronOfferForm',(req,res)=>{
    res.render('patronOfferForm.ejs')
  });

  module.exports = router;


//   const express=require('express');
// const { check, validationResult } = require('express-validator');
// // const session = require('express-session');

// const mongoose = require('mongoose')
// const NGOUser = require('../models/ngouser')
// const request = require('../models/req')

// const router = express.Router();
// const bodyparser=require('body-parser');
// var nodemailer = require('nodemailer');
// var urlencodedparser=bodyparser.urlencoded({extended:false});
// bodyParser = require('body-parser').json();

// router.get('/hello',(req,res)=>{
//     res.render('helloworld.ejs')
//   });

// router.get('/push',(req,res)=>{
//     let newNGOUser = new NGOUser({
//         name: 'WeLovePeace',
//         contact: 9889889889,
//         email: 'welovepeace@go.com',
//         password: 'hi@1234',
//         home_address:{ street: 'Shein Kutler Road',
//         locality: 'Meine glucklish', city: 'Berlin', zipcode: '120728'}
// })

// newNGOUser.save()
// .then(console.log("SAVED!"))
//   });

// router.get('/req',(req,res)=>{
//     let newreq = new request({
//         refugees : ['622d27ef3ac00628861f6551'],
//         numofppl: ['622d27ef3ac00628861f6551'].length,
//         status: 'Pending',
//         assigned: '622d247386c929fa64d0fffb'
//     })

// newreq.save()
// .then(console.log("Saved."))
// })


//   module.exports = router;
