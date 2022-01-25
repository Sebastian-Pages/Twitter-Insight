const express = require("express");
const morgan = require("morgan");
const https = require('https')


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

app.get("/t1", (req1, res) => {
  const req = https.request(options, res => {
    console.log(`statusCode: ${res.statusCode}`)
  
    res.on('data', d => {
      res.status(400).send("data: ",d)
    })
  })
  req.on('error', error => {
    console.error(error)
  })
  
  req.end()
});

app.get("/", (req, res) =>
  res.status(400).send("Welcome To Twitter Insight 🐦")
);

app.listen(PORT, hostname, () =>
  console.log(`Server running at http://${hostname}:${PORT}/`)
);
