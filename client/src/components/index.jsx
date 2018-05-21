import React from 'react';
import ReactDOM from 'react-dom';

import FetchUrl from './fetchUrl.jsx';
import CheckStatus from './CheckStatus.jsx';
import JobList from './JobList.jsx';

const axios = require('axios');
const helpers = require('../../../helpers/helpers.js');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadUrl: '',	// stored state of external html body
			allJobs: [],	// all jobs (db/queue)
		}
		this.fetchUrlFromUser = this.fetchUrlFromUser.bind(this);
		this.checkJob = this.checkJob.bind(this);
	}

	componentDidMount() {	// render all previous jobs from db
		axios.get('/storedJobs', {})
		.then(jobs => {	
			this.setState({
				allJobs: jobs.data,
			})
		})
		.catch(err => {
			throw err;
		})
	}

	createMarkup() {	// sets inner html
		return {__html: this.state.uploadUrl}
	}

	fetchUrlFromUser(url) {	// fetches url from user after user enters url, and retrieves job id
		this.cleanUploadUrl();
		if (helpers.isValidUrl(url)) {
			this.getIdForUrl(this, url);
		} else {
			alert('Not valid url!');
		}
	}

	getIdForUrl(content, url) {		// retrieves id (or alert) for entered url
		let encodedUrl = encodeURIComponent(url);
		axios.post(`/url/fetch?url=${encodedUrl}`, {
		})
		.then(jobId => {
			let { title, url, id } = jobId.data;
			if (title === 'Job already has id') {
				alert(`Job ${url} already has id ${id}`);
			} else if (title === 'New job') {
				let allJobs = this.state.allJobs;
				allJobs.push({url, id});
				content.setState({ allJobs, });			
			}
		})
		.catch(err => { throw err });			
	}

	checkJob(id) {	// checks status of id, when user enters job id
		this.cleanUploadUrl();
		if (helpers.isValidId(id, this.state.allJobs)) {
			axios.get(`/id/:${id}`, {
				params: {
					id,
				},
			})
			.then(res => {
				if (res.data === 'Job is still in queue') {
					alert(`Job of ${id} is still in queue`);
				} else if (res.data.data === 'URL is not valid') {
					alert(`Job of ${id}: url ${res.data.url} is not valid`)
				} else {
					this.setState({ uploadUrl: res.data.data });
				}
			})				
		} else {
			alert(`There's no such id`);
			
		}
	}

	cleanUploadUrl() {	// cleans uploadUrl 
		this.setState({ uploadUrl: '' });
	}

	render() {
		let currJob = this.state.allJobs[this.state.allJobs.length - 1] || { url: '', id: ''};
		return (
			<div>
				<h1>Welcome to Job Queue</h1>
				<h2>Please enter a url, starting with www (without the http/https):</h2>
				<FetchUrl 
					FetchUrl={this.fetchUrlFromUser} 
					currJob={currJob}
				/>
				<CheckStatus 
					checkJob={this.checkJob}
				/>
				<JobList
					JobList={this.state.allJobs} 
				/>
				{ this.state.uploadUrl ? (
					<div>
						<h3>Job asked:</h3>
						<div className="external-html" 
							dangerouslySetInnerHTML={this.createMarkup()}>
						</div>
					</div>
				) : (
				<div></div>
				) }
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("main"));
