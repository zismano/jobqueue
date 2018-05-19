const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');
app.use('/', express.static(path.join(__dirname, '../client/dist')));

const db = require('../database/index.js');

const jobQueue = require('../helpers/jobQueue.js');


// app.get('/url/:url', (req, res) => {
// 	let url = req.params.url.split(':')[1];
// 	http.get({ host: url }, response => {
// 		let body = '';
// 		response.on('data', chunk => {
// 			body += chunk;
// 		})
// 		response.on('end', () => {
// 		  if (body === '') {
// 		  	https.get({ host: url }, response => {
// 		  		let body = '';
// 				response.on('data', chunk => {
// 					body += chunk;
// 				})
// 				response.on('end', () => {		  		
// 					res.send(body);
// 				})
// 			})
// 		  } else {
// 			  res.send(body);		  	
// 		  }
// 		})
// 	})
// })

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
			jobQueue.addJobToQueue(url, (err, id) => {
				if (err) throw err;
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
	db.findHTMLOfId(id, data => {
		if (data) {
			res.sendStatus(200).send(data);
		} else {
			res.sendStatus(200).send('Job is not finished yet');
		}
	})
	// keep track of id (check if user put something else than number)
});


app.listen(3000);