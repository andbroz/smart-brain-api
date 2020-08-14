const express = require('express');
// const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); //https://www.npmjs.com/package/bcrypt
const cors = require('cors'); //https://www.npmjs.com/package/cors

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const port = 3001;
const saltRounds = 10;

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: '$2b$10$.qZhsnk2WfGJcUXFHbzXNOaFamtclYSCY9ShFpQsa5A94PxHzekDS', //cookies
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: '$2b$10$6ee7KXVvAl88ag46VCuYHepuKtnzHUSf8IsYEYR43jLaTTWtZMNbq', //bananas
			entries: 0,
			joined: new Date(),
		},
	],
	login: [
		{
			id: '987',
			hash: '',
			email: 'john@gmail.com',
		},
	],
};

// main route
app.get('/', (req, res) => {
	res.json(database.users);
});

// signin route
app.post('/signin', async (req, res) => {
	const { email, password } = req.body;

	const user = database.users.find(user => user.email === email);
	try {
		const match = await bcrypt.compare(password, user.password);

		if (match) {
			res.json('success');
		} else {
			res.status(404).json('error logging in');
		}
	} catch (err) {
		res.status(404).json('some error occured during logging in');
	}
});

// register new user route
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;

	bcrypt.hash(password, saltRounds, function (err, hashPassword) {
		if (!err) {
			const userId = database.users.push({
				id: String(Number(database.users[database.users.length - 1].id) + 1),
				name: name,
				email: email,
				password: hashPassword,
				entries: 0,
				joined: new Date(),
			});
			res.json(database.users[userId - 1]);
		} else {
			console.log('crating hash failed: ', err);
			res.json('some error occured');
		}
	});
});

// user profile route

app.get('/profile/:userId', (req, res) => {
	console.log(req.params);
	const { userId } = req.params;

	let found = false;

	database.users.forEach(user => {
		if (user.id === userId) {
			found = true;
			return res.json(user);
		}
	});

	if (!found) {
		res.status(404).json('no such user');
	}
});

// image entries route

app.put('/image', (req, res) => {
	const { id } = req.body;

	let found = false;

	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++;
			return res.json(user.entries);
		}
	});

	if (!found) {
		res.status(404).json('no such user');
	}
});

app.listen(port, () => {
	console.log(`server started at port ${port}`);
});
