const express = require('express'); //http://expressjs.com/
const bcrypt = require('bcrypt'); //https://www.npmjs.com/package/bcrypt
const cors = require('cors'); //https://www.npmjs.com/package/cors
const knex = require('knex'); //http://knexjs.org/
const signin = require('./controllers/signin');
const register = require('./controllers/register');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const app = express();

app.use(express.json());
app.use(cors());

const port = process.env.PORT || 3000;

const db = knex({
	client: 'pg',
	connection: {
		connectionString: process.env.DATABASE_URL,
		ssl: {
			rejectUnauthorized: false,
		},
	},
});

app.get('/', (req, res) => {
	res.json('Welcome to smart brain API');
});
app.post('/signin', signin.handleSignin(db, bcrypt));
app.post('/register', register.handleRegister(db, bcrypt));
app.get('/profile/:userId', profile.handleProfileGet(db));
app.put('/image', image.handleImage(db));
app.post('/facedetect', image.handleFaceDetect);

app.listen(port, () => {
	console.log(`server started at port ${port}`);
});
