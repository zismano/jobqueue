const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');
app.use('/', express.static(path.join(__dirname, '../client/dist')));

const db = require('../database/index.js');

const jobQueue = require('../helpers/jobQueue.js');

app.post('/url/:url', (req, res) => {
	let url = req.params.url.split(':')[1];	// extract url from request
	// check if url already has id
	db.doesUrlHaveJobId(url, (id) => {
		if (id) {
			let responseObject = {
				title: 'Job already has id',
				url,
				id,
			}
			res.send(responseObject);			
		} else {
			jobQueue.addJobToQueue(url, (id) => {				
				let responseObject = {
					title: 'New job',
					url,
					id,
				}
				res.send(responseObject);
			})
		}
	})
});

app.get('/id/:id', (req, res) => {
	let id = req.params.id.split(':')[1];
	// check html of id in db
	db.findHTMLOfId(id, answer => {
		if (answer === 'No id was found') {
			res.send('Job is still in queue');	// job is still in queue
		} else if (answer.data === 'URL is not valid') {
			res.send(answer);
		} else {
			res.send(answer);
		}
	})
	// keep track of id (check if user put something else than number)
});


app.listen(3000);