const isValidId = (id, jobs) => {		// checks if id entered is valid. Assumption: last element in allJobs state is highest id
	if (jobs.length && 
		id > 0 &&
		!(id % 1) &&  
		id <= jobs[jobs.length - 1].id) {
		return true;
	}
	return false;
}

module.exports = {
	isValidId
}