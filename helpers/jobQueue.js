const http = require('http');
const https = require('https');
const kue = require('kue');
const db = require('../database/index.js');

let jobs = kue.createQueue();

const addJobToQueue = (url, cb) => {	// adds job to queue, on complete - removes it from queue	
	let job = jobs.create('new_job', {
		url,
	})

	job
	.on('complete', function() {
		console.log(`Job ${job.id} with url ${job.data.url} is completed`);
		kue.Job.get(job.id, (err, job) => {
			job.remove();
			console.log(`Job ${job.id} with url ${job.data.url} was removed from queue`);
		} )
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
	const url = job.data.url;
	const indexEndOfHost = job.data.url.indexOf('/');
	let host = indexEndOfHost !== -1 ? job.data.url.slice(0, indexEndOfHost) : job.data.url;
	let path = indexEndOfHost !== -1 ? job.data.url.slice(indexEndOfHost) : '/';
	let request = http.get({ host, path }, res => {	// http
		let body = '';
		res.on('data', chunk => {
			body += chunk;
		})
		res.on('end', () => {
		  if (body === '') {	// if there's no body, check for https (secure) request
		  	https.get({ host, path }, res => {	
		  		let body = '';
				res.on('data', chunk => {
					body += chunk;
				})
				res.on('end', () => {
					if (body === '') {
						body = 'URL is not valid';
					}
					db.addHTMLtoId(job.id, url, body, (err, res) => {
						if (err) throw err;
						console.log(`id ${job.id}, job ${url} done fetching html`);
						done && done();
					})						
				})
			})
		  } else {
			db.addHTMLtoId(job.id, url, body, (err, res) => {
				if (err) throw err;
				console.log(`id ${job.id}, job ${url} done fetching html`);
				done && done();
			})	  	
		  }
		})
	})
	request.on('error', (err) => {
		db.addHTMLtoId(job.id, url, 'URL is not valid', (err, res) => {
			if (err) throw err;
			console.log(`id ${job.id}, job ${url} is not valid`);
			done && done();
		})
	})
})

module.exports = {
	addJobToQueue,	
}