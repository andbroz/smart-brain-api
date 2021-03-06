const handleProfileGet = db => (req, res) => {
	const { userId } = req.params;

	if (!userId) {
		return res.status(400).json('Wrong request!');
	}

	db.select('*')
		.from('users')
		.where({
			id: userId,
		})
		.then(user => {
			if (user.length) {
				res.json(user[0]);
			} else {
				res.status(400).json('Not found');
			}
		})
		.catch(err => res.status(400).json('Error getting user'));
};

module.exports = {
	handleProfileGet,
};
