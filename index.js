const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const hbase = require('hbase');

const app = express();
const port = config.api_port;

app.use(bodyParser.json());

app.use(cors());

app.use('/api/test', require('./routes/test'));

app.listen(port, () => {
  console.log(`server listening on ${port}`);
})