var MongoClient = require('mongodb').MongoClient;
let jobsDB;

MongoClient.connect("mongodb://localhost:27017", function(err, client) {
	jobsDB = client.db('jobqueue');
})

const doesUrlHaveJobId = (urlFromUser, cb) => {
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

const findHTMLOfId = (id, cb) => {
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

const addHTMLtoId = (id, url, data, cb) => {
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

const findAllJobs = cb => {
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