const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require('knex');

const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image')

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false},
    host: process.env.DATABASE_HOST,
    port: '5432',
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});

const app = express();

app.use(bodyParser.json());

const corsOptions = {
  origin: 'https://smartbrain-pjgm.onrender.com', // Only allow this origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allow specific methods
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization", // Specify allowed headers
  credentials: true, // Allow cookies or credentials
  optionsSuccessStatus: 200 // Some legacy browsers choke on a 204 status
};

app.use(cors(corsOptions));


app.get('/', (req, res) => {
  db.select('*').from('user')
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error fetching users'));
});
app.post("/signin", signin.handleSignin (db, bcrypt));
app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});
app.get("/profile/:id",(req, res) => {profile.handleProfile(req,res,db)});
app.put("/image", (req, res) => {image.handleImage(req, res, db)});
app.post("/imageurl", (req, res) => {image.handleApiCall(req, res)});

app.listen(process.env.PORT || 3000, () => {
  console.log(`app is running on port ${process.env.PORT}`);
});
