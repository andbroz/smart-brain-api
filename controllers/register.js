const saltRounds = 10;

const handleRegister = (db, bcrypt) => (req, res) => {
	const { email, password, name } = req.body;

	if (!email || !password || !name) {
		return res.status(400).json('That was nasty. No empty data!');
	}

	bcrypt.hash(password, saltRounds, function (err, hashPassword) {
		if (!err) {
			db.transaction(trx => {
				trx
					.insert({
						hash: hashPassword,
						email: email,
					})
					.into('login')
					.returning('email')
					.then(([loginEmail]) => {
						return trx('users')
							.returning('*')
							.insert({
								email: loginEmail,
								name: name,
								joined: new Date(),
							})
							.then(user => {
								res.json(user[0]);
							});
					})
					.then(trx.commit)
					.catch(trx.rollback);
			}).catch(err => res.status(400).json('unable to register'));
		} else {
			console.log('creating hash failed: ', err);
			res.json('some error occured');
		}
	});
};

module.exports = {
	handleRegister: handleRegister,
};
