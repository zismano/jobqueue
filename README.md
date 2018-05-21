# jobqueue

Creating a job queue whose workers fetch data from a URL and store the results in a database. The job queue should expose a REST API for adding jobs and checking their status / results.

Example:

User submits www.google.com to your endpoint. The user gets back a job id. Your system fetches www.google.com (the result of which would be HTML) and stores the result. The user asks for the status of the job id and if the job is complete, he gets a response that includes the HTML for www.google.com.

### Installing Dependencies

From the command line:

Make sure MongoDB server is up by:

```sh
mongod --dbpath [path to /data/db]
```

MAke sure Redis server is up by:

```sh
redis-server
```

From within the root directory:

```sh
npm install
```

```sh
npm run start
```

From the browser:

```sh
localhost:3000
```

## Requirements

* Node
* NPM
* MongoDB server 
* Redis server

## Built With

* React
* ExpressJS
* MongoDB
* Redis