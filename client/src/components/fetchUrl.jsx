import React from 'React';

const FetchUrl = props => {
	let inputUrl;
	let { url, id } = props.currJob;
	return (
		<div>
			<form>
				<input type="text" 
					   placeholder="www.google.com" 
					   ref={input => inputUrl = input}>
				</input>
				<button onClick={(e) => {
					e.preventDefault();
					props.FetchUrl(inputUrl.value);
					}}>Submit
				</button>
			</form>
			{ url !== '' ? (
			  	<div>url {url} was recently added to queue with job id {id}</div>
			  ) : (
			  	<div></div>
			  ) }
		</div>
	);
}

export default FetchUrl;