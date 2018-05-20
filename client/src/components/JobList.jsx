import React from 'react';
import JobEntry from './JobEntry.jsx';

const JobList = props => {
	return (
		<div>
			<ul> 
				List of Jobs:
				{props.JobList.map(job =>
					<JobEntry job={job} />)}
			</ul>
		</div>
	)
}

export default JobList; 