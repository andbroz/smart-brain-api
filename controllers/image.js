const Clarifai = require('clarifai');

// https://docs.clarifai.com/api-guide/api-overview/api-clients
const app = new Clarifai.App({
	apiKey: process.env.CLARIFAIKEY,
});

const handleFaceDetect = (req, res) => {
	// https://www.clarifai.com/models/face-detection-image-recognition-model-a403429f2ddf4b49b307e318f00e528b-detection
	app.models
		.predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
		.then(data => {
			res.json(data);
		})
		.catch(err => res.status(400).json('Unable to work with API'));
};

const handleImage = db => (req, res) => {
	const { id } = req.body;
	db('users')
		.where('id', '=', id)
		.increment('entries', 1)
		.returning('entries')
		.then(entries => {
			res.json(entries[0]);
		})
		.catch(err => res.status(400).json('unable to get entries'));
};

module.exports = {
	handleImage,
	handleFaceDetect,
};
