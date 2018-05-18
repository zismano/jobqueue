const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

const path = require('path');
app.use('/', express.static(path.join(__dirname, '../client/dist')));

const http = require('http');

app.post('/url/:url', (req, res) => {
	let url = req.params.url.split(':')[1];
	http.get({ host: url }, response => {
		let body = '';
		response.on('data', chunk => {
			body += chunk;
		})
		response.on('end', () => {
		  res.send(body);
		})
	})
})

app.listen(3000);