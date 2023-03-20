/************************************************************************************
* WEB322 â€“ Project (Winter 2022)
* I declare that this assignment is my own work in accordance with Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* Name: Yaqin Liu
* Student ID: 137117198
* Course/Section: WEB322_NDD
*
************************************************************************************/

const path = require("path");
const express = require("express");
const app = express();
// const { getTopMeals, getMealsByCategory } = require('./models/mealkit-db')
require('dotenv').config()
const mongoose = require("mongoose");

const cookieParser = require("cookie-parser");
const sessions = require('express-session');
var multer = require('multer');
//var upload = multer({ dest: 'uploads/' });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ storage: storage });
//app.use(upload.array()); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// creating 24 hours from milliseconds
const oneDay = 1000 * 60 * 60 * 24;

//session middleware
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());

mongoose.connect('mongodb+srv://testuser:JHVFXBBkdVvr3jZj@cluster0.qs0k7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    .then(res => console.log(`Connection Succesful ${res}`))
    .catch(err => console.log(`Error in DB connection ${err}`));


const sgMail = require('@sendgrid/mail')


var bodyParser = require('body-parser')

var authValidation = require('./helpers/validations/auth')

// create application/json parser
var jsonParser = bodyParser.json()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

const sendGridKey = process.env.SENDGRID_KEY

//Loads the handlebars module
//const handlebars = require('express-handlebars');
const { engine } = require('express-handlebars');
//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
//instead of app.engine('handlebars', handlebars({
app.engine('hbs', engine({
    layoutsDir: __dirname + '/views/layouts',
    extname: 'hbs',
    //new configuration parameter
    defaultLayout: 'main',
    partialsDir: __dirname + '/views/partials/',
    helpers: { select: function(selected, options) {
        return options.fn(this).replace(
            new RegExp(' value=\"' + selected + '\"'),
            '$& selected="selected"');
        }
    }
}));

const AuthCtrl = require("./controllers/auth.controller");
const Credential = require("./controllers/credential.controller");
const Loaddata = require("./controllers/loaddata.controller");
const MealkitService = require("./services/MealkitService");

app.use('/', express.static(path.join(__dirname, './assets')));
app.use('/', express.static(path.join(__dirname, './uploads')));

let isLoggedIn = false;
let firstName = '';
let role = false;
app.use(function (req, res, next) {
    const session = req.session;
    if (session != undefined && session.firstName !== undefined) {
        isLoggedIn = true;
        firstName = session.firstName;
        role = session.role == '1' ? true : false;
    } else {
        isLoggedIn = false;
        firstName = '';
        role = false;
    }
    next()
})
app.get('/', Loaddata.apiHome);

app.get('/menu', Loaddata.apiMenu)

app.get('/mealkit-detail/:id', Loaddata.apiMealkitDetail)

app.get('/signup', function (req, res, next) {
    res.render('signup', { layout: 'main', listExists: true });
})

app.post('/signup', AuthCtrl.apiSignup)

app.get('/login', function (req, res, next) {
    res.render('login', { layout: 'main', listExists: true });
})

app.get('/credential', Credential.setCrential)

app.post('/login', AuthCtrl.apiLogin)

app.get('/clerk-dashboard', function (req, res, next) {
    const session = req.session;
    if (session.userid !== undefined && session.userid !== null && session.role === '1') {
        res.render('clerkDashboard', { layout: 'main', listExists: true, isLoggedIn: isLoggedIn, firstName: firstName, role: role });
    } else {
        res.redirect('/login');
    }
})


app.post('/add-to-cart', AuthCtrl.apiAddToCart)
app.delete('/delete-item-cart/:cartId/:id', AuthCtrl.apiDeleteToCart)
app.post('/update-item-cart', AuthCtrl.apiUpdateToCart)
app.get('/cart-details', AuthCtrl.apiCartDetails)
app.post('/place-order', AuthCtrl.apiOrderPlace)

// app.use(function (req, res, next) {

//     var authorised = false;
//     //Here you would check for the user being authenticated

//     //Unsure how you're actually checking this, so some psuedo code below
//     if (authorised) {
//         //Stop the user progressing any further
//         return res.status(403).send("Unauthorised!");
//     }
//     else {
//         //Carry on with the request chain
//         next();
//     }
// });


app.get('/load-data/meal-kits', Loaddata.apiAllData)

app.get('/add-data', function (req, res, next) {
    const session = req.session;
    if (session.userid !== undefined && session.userid !== null) {
        res.render('mealkit/add', { layout: 'main', listExists: true, isLoggedIn: isLoggedIn, firstName: firstName, role: role });
    } else {
        res.redirect('/login');
    }
})
app.post('/add-data', upload.single('file'), Loaddata.apiAddData)

app.get('/update-data/:id',  Loaddata.apiGetUpdateData)
app.post('/update-data',  Loaddata.apiPostUpdateData)

app.post('/delete-data',  Loaddata.apiDeleteData)


app.get('/customer-dashboard', function (req, res, next) {
    const session = req.session;
    if (session.userid !== undefined && session.userid !== null && session.role === '2') {
        res.render('customerDashboard', { layout: 'main', listExists: true, isLoggedIn: isLoggedIn, firstName: firstName, role: role });
    } else {
        res.redirect('/login');
    }
})


// POST /login gets urlencoded bodies


app.get('/welcome', function (req, res) {
    const session = req.session;
    if (session.userid !== undefined && session.userid !== null) {
        res.render('welcome', { layout: 'main', user: {}, listExists: true });
    } else {
        res.redirect('/login');
    }
})

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// *** DO NOT MODIFY THE LINES BELOW ***

// This use() will not allow requests to go beyond it
// so we place it at the end of the file, after the other routes.
// This function will catch all other requests that don't match
// any other route handlers declared before it.
// This means we can use it as a sort of 'catch all' when no route match is found.
// We use this function to handle 404 requests to pages that are not found.
app.use((req, res) => {
    res.status(404).send("Page Not Found");
});


// This use() will add an error handler function to
// catch all errors.
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send("Something broke!")
});

// Define a port to listen to requests on.
const HTTP_PORT = process.env.PORT || 8080;

// Call this function after the http server starts listening for requests.
function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

// Listen on port 8080. The default port for http is 80, https is 443. We use 8080 here
// because sometimes port 80 is in use by other applications on the machine
app.listen(HTTP_PORT, onHttpStart);