const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbase = require("hbase");
const morgan = require("morgan");

const PORT = 7000;
const hostname = "127.0.0.1";
const client = hbase({ host: "http://lsd-prod-namenode-0.lsd.novalocal", port: 8080 });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(morgan("combined"));

app.get('/t1', (req,res) => {
  client
      .table('ypages:t1')
      .row('0')
      .get("loc", (err,cell) => 
          err ? res.sendStatus(404) : res.json(cell)
      );
});

app.get("/api", (req, res) =>{
  fetch('http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:t1/0')
  .then(response => response.json())
  .then(data => res.status(400).send("This is the Data: ",data));
});



app.get("/", (req, res) =>
  res.status(400).send("Welcome To Twitter Insight 🐦")
);

app.listen(PORT, hostname, () =>
  console.log(`Server running at http://${hostname}:${PORT}/`)
);
