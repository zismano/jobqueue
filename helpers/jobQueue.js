const http = require('http');
const https = require('https');
const kue = require('kue');
const db = require('../database/index.js');

let jobs = kue.createQueue();

const addJobToQueue = (url, callback) => {	
	let job = jobs.create('new_job', {
		url,
	}).save(err => {
		if (err) {
			callback(err);
		} else {
			callback(null, job.id);			
		}
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
};

jobs.process('new_job', function(job, done) {
	http.get({ host: job.data.url }, res => {
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
					db.addHTMLtoId(job.id, job.data.url, body, (err, res) => {
						if (err) throw err;
						console.log(`id ${job.id}, job ${job.data.url} done fetching html`);
					})
				})
			})
		  } else {
			db.addHTMLtoId(job.id, job.data.url, body, (err, res) => {
				if (err) throw err;
				console.log(`id ${job.id}, job ${job.data.url} done fetching html`);
			})	  	
		  }
		})
	})
})

module.exports = {
	addJobToQueue,	
}