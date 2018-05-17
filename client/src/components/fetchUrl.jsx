import React from 'React';

let FetchUrl = props => {
	let url;
	return (
		<div>
			<form>
				<input type="text" 
					   placeholder="www.google.com" 
					   ref={input => url = input}>
				</input>
				<button onClick={(e) => {
					e.preventDefault();
					props.getUrl(url.value);
				}}>Submit</button>
			</form>
		</div>
	);
}

export default FetchUrl;