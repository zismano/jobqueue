import React from 'react';

const CheckStatus = props => {
	let {checkJob, maxJobs } = props;
	let jobId;
	return (
		<div>
			<input type="number" min="0" max={maxJobs} ref={input => jobId = input}></input>
			<button onClick={() => props.checkJob(jobId)}>Check Status of Job ID</button>
		</div>
	)
}

export default CheckStatus;