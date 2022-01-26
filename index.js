const express = require("express");
const morgan = require("morgan");
const https = require('https')
const axios = require('axios');

const PORT = 7000;
const hostname = "127.0.0.1";
const options = {
  hostname: 'http://lsd-prod-namenode-0.lsd.novalocal',
  port: 8080,
  path: '/ypages:t1/0',
  method: 'GET'
}


const app = express();

app.use(morgan("combined"));

app.get("/t1", (req, res) =>
  res.status(400).send("Welcome To Twitter Insight 🐦:",getData())
);

function getData(){
  axios.get('http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:t1/0')
    .then(res => {
      const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
      console.log('Status Code:', res.status);
      console.log('Date in Response header:', headerDate);

      const users = res.data;
      return users;
      // for(user of users) {
      //   console.log(`data: ${user}`);
      // }
    })
    .catch(err => {
      console.log('Error: ', err.message);
    });
}

app.get("/", (req, res) =>
  res.status(400).send("Welcome To Twitter Insight 🐦")
);

app.listen(PORT, hostname, () =>
  console.log(`Server running at http://${hostname}:${PORT}/`)
);
