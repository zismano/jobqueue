import React from 'react';

const CheckStatus = props => {
	let {checkJob } = props;
	let jobId;
	return (
		<div>
			<input type="number" min="1" ref={input => jobId = input}></input>
			<button onClick={() => props.checkJob(jobId.value)}>Check Status of Job ID</button>
		</div>
	)
}

export default CheckStatus;