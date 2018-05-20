import React from 'react';
import ReactDOM from 'react-dom';

import FetchUrl from './fetchUrl.jsx';
import CheckStatus from './CheckStatus.jsx';
import JobList from './JobList.jsx';

const axios = require('axios');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uploadUrl: '',
			allJobs: [],
			currJob: {
				url: '',
				id: '',
			},
		}
		this.fetchUrlFromUser = this.fetchUrlFromUser.bind(this);
		this.checkJob = this.checkJob.bind(this);
	}

	componentDidMount() {
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

	createMarkup() {
		return {__html: this.state.uploadUrl}
	}

	fetchUrlFromUser(url) {
		if (this.isValidUrl) {
			this.getIdForUrl(this, url);
		} else {
			console.log('not valid url')
		}
	}

	isValidUrl(url) {	// very basic check, returns true if url has 1-3 dotts in name and no spaces
		let splittledUrl = url.split(' ');
		if (splittedUrl.length === 1) {
			let splittedUrl = url.split('.');
			if (splittedUrl.length > 1 && splittedUrl.length < 5) {
				return true;
			}
		}
		return false;
	}

	getIdForUrl(content, url) {
		axios.post(`/url/:${url}`, {
			params: {
				url,			
			},
		})
		.then(jobId => {
			let { title, url, id } = jobId.data;
			if (title === 'Job already has id') {
				alert(`Job ${url} already has id ${id}`);
			} else if (title === 'New job') {
				let allJobs = this.state.allJobs;
				allJobs.push({url, id});
				content.setState({ 
					currJob: { 
						url, 
						id,
					},
					allJobs,
				})				
			}
		})
		.catch(err => { throw err });			
	}

	checkJob(id) {
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
	}

	render() {
		return (
			this.state.uploadUrl ? (
			<div dangerouslySetInnerHTML={this.createMarkup()}></div>
			) : (
			<div>
				<h1>Welcome to Job Queue</h1>
				<h2>Please enter a url:</h2>
				<FetchUrl 
					FetchUrl={this.fetchUrlFromUser} 
					currJob={this.state.currJob}
				/>
				<CheckStatus 
					checkJob={this.checkJob}
				/>
				<JobList
					JobList={this.state.allJobs} 
				/>
			</div>
			)
		)
	}
}

ReactDOM.render(<App />, document.getElementById("main"));
