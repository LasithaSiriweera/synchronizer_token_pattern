const express = require('express')
let cors = require('cors')
let bodyParser = require('body-parser')
let cookieParser = require('cookie-parser')
const session = require('express-session')
let time = require('express-timestamp')
const uuid = require('uuid/v4')


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser());
app.use(time.init);

let user = {username: '', sessionId: '', token: ''};


app.use(session({
    genid: (req) => {
      return uuid()
    },
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

/**
 * User login
 */
app.post('/login', (req, res) => {
    if(req.body.username == "admin" && req.body.password == "admin") {
        user = {
            username: req.body.username,
            sessionId: req.sessionID,
            token: req.sessionID + req.timestamp
        }
        res.send({sessionId: user.sessionId});
    }
});

/**
 * Providing a CSRF token
 */
app.get('/getToken', function (req, res) {
    res.send({csrfToken: user.token});
});

/**
 * Transferring Token when request comes with correct CSRF token, *this will validate the CSRF token of request from client side whether  it's match with the server's CSRF token
 */
app.post('/transferToken', (req, res) => {
    if(req.headers.sid == user.sessionId) {
        if(req.body.token == user.token) {
            res.send({result: 'Transferring Successful'});
        }
        else {
            res.send({result: 'Invalid Token'});
        }
    }
    else {
        res.send({result: 'Invalid Cookie'});
    }
});


const port = process.env.PORT || 3000;
app.listen(3000, () => console.log(`Listening on port ${port}...`));