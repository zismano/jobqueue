const http = require('http');
const https = require('https');
const kue = require('kue');
const db = require('../database/index.js');

let jobs = kue.createQueue();

const addJobToQueue = (url, cb) => {	
	let job = jobs.create('new_job', {
		url,
	})

	job
	.on('complete', function() {
		console.log(`Job ${job.id} with url ${job.data.url} is completed`);
		job.on('remove', function() {
			console.log(`Job ${job.id} with url ${job.data.url} is removed from queue`);
		})
	})
	.on('failed', function() {
		console.log(`Job ${job.id} with url ${job.data.url} has failed`);
	})

	job.save(err => {
		if (err) throw err;
		cb(job.id);
	})
};

jobs.process('new_job', function(job, done) {
	let request = http.get({ host: job.data.url }, res => {
		let body = '';
		res.on('data', chunk => {
			body += chunk;
		})
		res.on('end', () => {
		  if (body === '') {
		  	https.get({ host: job.data.url }, res => {
		  		let body = '';
				res.on('data', chunk => {
					body += chunk;
				})
				res.on('end', () => {
					if (body === '') {
						body = 'URL is not valid';
					}
					db.addHTMLtoId(job.id, job.data.url, body, (err, res) => {
						if (err) throw err;
						console.log(`id ${job.id}, job ${job.data.url} done fetching html`);
						done && done();
					})						
				})
			})
		  } else {
			db.addHTMLtoId(job.id, job.data.url, body, (err, res) => {
				if (err) throw err;
				console.log(`id ${job.id}, job ${job.data.url} done fetching html`);
				done && done();
			})	  	
		  }
		})
	})
	request.on('error', (err) => {
		db.addHTMLtoId(job.id, job.data.url, 'URL is not valid', (err, res) => {
			if (err) throw err;
			console.log(`id ${job.id}, job ${job.data.url} is not valid`);
			done && done();
		})
	})
})

module.exports = {
	addJobToQueue,	
}