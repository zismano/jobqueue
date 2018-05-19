const MongoClient = require('mongodb').MongoClient;
 
// Connection URL
const urlMongoDB = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'jobqueue';
 
// Use connect method to connect to the server


const doesUrlHaveJobId = (urlFromUser, cb) => {
	MongoClient.connect(urlMongoDB, function(err, client) {
	  if (err) throw err;	
	  console.log("Connected successfully to server");
	 
	  const jobsDB = client.db(dbName);

	  jobsDB.collection("urls").findOne({"url": urlFromUser})
	  .then(doc => {
	  	if (!doc) {
	  		cb(null);
	  	} else {
	  		cb(doc.jobId);
	  	}
	  })
	  .catch(err => { throw err })
	});	
}

const findHTMLOfId = (id, cb) => {
	MongoClient.connect(urlMongoDB, function(err, client) {
	  if (err) throw err;
	  console.log("Connected successfully to server");
	 
	  const jobsDB = client.db(dbName);

	  jobsDB.collection("urls").findOne({"jobId": id})
	  .then(doc => {
	  	if (doc) {
	  		cb(doc.data);
	  	}
	  })
	  .catch(err => {
	  	throw err;
	  })
	});		
}

const addHTMLtoId = (id, url, data, cb) => {
	MongoClient.connect(urlMongoDB, function(err, client) {
	  if (err) throw err;
	  console.log("Connected successfully to server");
	 
	  const jobsDB = client.db(dbName);

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
	});			
}

module.exports = {
	doesUrlHaveJobId,
	findHTMLOfId,
	addHTMLtoId,
}