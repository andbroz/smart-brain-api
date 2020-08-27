require('dotenv').config();
const express = require('express');
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //https://www.npmjs.com/package/bcrypt
const cors = require('cors'); //https://www.npmjs.com/package/cors
const knex = require('knex');
const { response } = require('express');

const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = 3001;

const db = knex({
	client: 'pg',
	version: '12.2',
	connection: {
		host: process.env.DB_HOST,
		user: process.env.DB_USER,
		password: process.env.DB_PASS,
		database: process.env.DB_NAME,
	},
});

// main route
app.get('/', (req, res) => {
	db.select('*')
		.from('users')
		.then(users => {
			res.json(users);
		});
});

app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:userId', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));

app.listen(port, () => {
	console.log(`server started at port ${port}`);
});
