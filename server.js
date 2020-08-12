const express = require('express');
// const bodyParser = require('body-parser');

const app = express();

// app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const port = 3000;

const database = {
	users: [
		{
			id: '123',
			name: 'John',
			email: 'john@gmail.com',
			password: 'cookies',
			entries: 0,
			joined: new Date(),
		},
		{
			id: '124',
			name: 'Sally',
			email: 'sally@gmail.com',
			password: 'bananas',
			entries: 0,
			joined: new Date(),
		},
	],
};

// main route
app.get('/', (req, res) => {
	res.json(database.users);
});

// signin route
app.post('/signin', (req, res) => {
	const { email, password } = req.body;

	if (
		email === database.users[0].email &&
		password === database.users[0].password
	) {
		res.json('success');
	}

	res.status(404).json('error logging in');
});

// register new user route
app.post('/register', (req, res) => {
	const { email, password, name } = req.body;

	const userId = database.users.push({
		id: String(Number(database.users[database.users.length - 1].id) + 1),
		name: name,
		email: email,
		password: password,
		entries: 0,
		joined: new Date(),
	});

	res.json(database.users[userId - 1]);
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
