const handleSignin = (db, bcrypt) => (req, res) => {
	const { email, password } = req.body;

	if (!email || !password) {
		return res.status(400).json('That was nasty. No empty data!');
	}

	db.select('email', 'hash')
		.from('login')
		.where('email', '=', email)
		.then(async ([login]) => {
			const match = await bcrypt.compare(password, login.hash);
			if (match) {
				db.select('*')
					.from('users')
					.where('email', '=', email)
					.then(user => {
						res.json(user[0]);
					})
					.catch(err => res.status(400).json('unable to get user'));
			} else {
				res.status(400).json('error logging in');
			}
		})
		.catch(err => res.status(400).json('wrong credentials'));
};

module.exports = {
	handleSignin: handleSignin,
};
