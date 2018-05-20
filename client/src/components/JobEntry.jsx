import React from 'react';

const JobEntry = props => {
	return (
		<li>#{props.job.id} {props.job.url}</li>
	)
}

export default JobEntry;