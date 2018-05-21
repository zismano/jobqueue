const isValidUrl = url => {	// very basic check, returns true if url has 1-3 dotts in name and no spaces
	let splittedUrl = url.split(' ');
	if (splittedUrl.length === 1) {
		let splittedUrl = url.split('.');
		if (splittedUrl.length > 1 && splittedUrl.length < 5) {
			return true;
		}
	}
	return false;
}

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
	isValidUrl,
	isValidId
}