import React from 'react';
import ReactDOM from 'react-dom';

import FetchUrl from './fetchUrl.jsx';

const axios = require('axios');

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			url: ''
		}
		this.fetchUrlFromUser = this.fetchUrlFromUser.bind(this);
	}

	createMarkup() {
		return {__html: this.state.url}
	}

	fetchUrlFromUser(url) {
		axios.post(`/url/:${url}`, {
			params: {
				url,			
			},
		})
		.then(res => this.setState({ url: res.data }))

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
