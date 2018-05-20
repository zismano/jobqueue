var MongoClient = require('mongodb').MongoClient;
let jobsDB;

// connection pool
MongoClient.connect("mongodb://localhost:27017", function(err, client) {
	jobsDB = client.db('jobqueue');
})

const doesUrlHaveJobId = (urlFromUser, cb) => {	// retrieves url's job id from db
	jobsDB.collection("urls").findOne({"url": urlFromUser})
	.then(doc => {
		if (!doc) {
			cb(null);
		} else {
			cb(doc.jobId);
		}
	})
	.catch(err => { throw err })
}

const findHTMLOfId = (id, cb) => {	// retrieves html of job id from db
	jobsDB.collection("urls").findOne({"jobId": id})
	.then(doc => {
		if (doc) {
			cb(doc);
		} else {
			cb('No id was found');
		}
	})
	.catch(err => {
		throw err;
	})
}

const addHTMLtoId = (id, url, data, cb) => {	// adds html of job id to db
	const row = {
		jobId: id,
		url,
		data,
	}
	jobsDB.collection("urls").insertOne(row, (err, res) => {
		if (err) {
			cb(err);
		} else {
			cb(null, res);
		}
	})
}

const findAllJobs = cb => {	// retrieves all jobs from db (for initial rendering)
	jobsDB.collection("urls").find({}).toArray((err, res) => {
		if (err) {
			cb(err);
		} else {
			cb(null, res);
		}
	})
}

module.exports = {
	doesUrlHaveJobId,
	findHTMLOfId,
	findAllJobs,
	addHTMLtoId,
}