import React from 'react';
import ReactDOM from 'react-dom';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

		}
	}

	render() {
		return (
			<div>
			<h1>Welcome to Job Queue</h1>
			<h2>Please enter a url:</h2>
			<form>
				<input type="text" placeholder="www.google.com"></input>
				<button>Submit</button>
			</form>
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById("main"));
