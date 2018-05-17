let express = require('express');
let app = express();

let bodyParser = require('body-parser');
app.use(bodyParser.json());

let path = require('path');
app.use('/', express.static(path.join(__dirname, '../client/dist')));

app.listen(3000);