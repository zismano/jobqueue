const http = require('http');
const https = require('https');
const kue = require('kue');
const db = require('mongodb');

let jobs = kue.createQueue();

const getJobIdForUrl = (url, callback) => {	
	let job = jobs.create('new_job', {
		url,
		body: '',
	})
	// .save(err => {
	// 	if (!err) {
	// 		console.log(job.id);
	// 		callback(job.id);						
	// 	}
	// });

	job
	.on('complete', function() {
		console.log('Job', job.id, 'with name', job.data.url, 'is done', job.data.body);
	})
	.on('failed', function() {
		console.log('Job', job.id, 'with name', job.data.url, 'has failed');
	})
	job.save();
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
					job.update(function() {
						job.data.body = body;
					})
				})
			})
		  } else {
			  job.update(function() {
			  	job.data.body = body;
			  	done && done();
			  })	  	
		  }
		})
	})
})

module.exports = {
	getJobIdForUrl,	
}