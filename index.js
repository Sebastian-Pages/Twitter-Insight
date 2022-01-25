const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbase = require("hbase");
const morgan = require("morgan");

const PORT = 7000;
const hostname = "127.0.0.1";
const client = hbase({ host: "127.0.0.1", port: 8080 });

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

app.get("/", (req, res) =>
  res.status(400).send("Welcome To Twitter Insight 🐦")
);

app.listen(PORT, hostname, () =>
  console.log(`Server running at http://${hostname}:${PORT}/`)
);
