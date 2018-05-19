import React from 'react';
import ReactDOM from 'react-dom';

import FetchUrl from './fetchUrl.jsx';

const axios = require('axios');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url: '',
			id: ''
		}
		this.fetchUrlFromUser = this.fetchUrlFromUser.bind(this);
	}

	createMarkup() {
		return {__html: this.state.url}
	}

	fetchUrlFromUser(url) {
		if (this.isValidUrl) {
			this.getIdForUrl(url);
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

	getIdForUrl(url) {
		axios.post(`/url/:${url}`, {
			params: {
				url,			
			},
		})
		.then(id => this.setState({ url, id }))
		.catch(err => { throw err });			
	}

	render() {
		return (
			this.state.url ? (
			<div dangerouslySetInnerHTML={this.createMarkup()}></div>
			) : (
			<div>
				<h1>Welcome to Job Queue</h1>
				<h2>Please enter a url:</h2>
				<FetchUrl FetchUrl={this.fetchUrlFromUser} />
{/*// {/*			<CheckStatus />
*/}			</div>
			 )
		)
	}
}

ReactDOM.render(<App />, document.getElementById("main"));
