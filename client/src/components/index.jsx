import React from 'react';
import ReactDOM from 'react-dom';

import FetchUrl from './fetchUrl.jsx';
import CheckStatus from './CheckStatus.jsx';

const axios = require('axios');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currJob: {
				url: '',
				id: '',
			},
			counter: 0,
		}
		this.fetchUrlFromUser = this.fetchUrlFromUser.bind(this);
		this.checkJob = this.checkJob.bind(this);
	}

	createMarkup() {
		return {__html: this.state.url}
	}

	fetchUrlFromUser(url) {
		if (this.isValidUrl) {
			this.getIdForUrl(this, url);
		} else {
			console.log('not valid url')
		}
	}

	isValidUrl(url) {	// returns true if url has 2-3 dotts in name and no spaces
		let splittledUrl = url.split(' ');
		if (splittedUrl.length === 1) {
			let splittedUrl = url.split('.');
			if (splittedUrl.length > 1 && splittedUrl.length < 4) {
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
		.then(id => {
			if (id.data.title === 'Job already has id') {
				alert(`Job ${id.data.url} already has id ${id.data.id}`);
			} else if (id.data.title === 'New job') {
				let counter = content.state.counter;
				content.setState({ 
					currJob: { 
						url, 
						id: counter + 1,
					},
					counter: counter + 1
				})				
			}
		})
		.catch(err => { throw err });			
	}

	checkJob(jobId) {

	}

	render() {
		return (
			this.state.url ? (
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
					maxJobs={this.state.counter}
				/>								 
			</div>
			)
		)
	}
}

ReactDOM.render(<App />, document.getElementById("main"));
