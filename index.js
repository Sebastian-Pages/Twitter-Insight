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

app.get("/t1", (req, res) => {
  const rows = [];
  scanner = client.table("node_table").scan({
    startRow: "my_row",
    maxVersions: 1,
  });
  scanner.on("readable", function () {
    while ((chunk = scanner.read())) {
      rows.push(chunk);
    }
  });
  scanner.on("error", function (err) {
    console.log(err);
  });
  scanner.on("end", function () {
    console.log(rows);
  });
});

app.get("/", (req, res) =>
  res.status(400).send("Welcome To Twitter Insight 🐦")
);

app.listen(PORT, hostname, () =>
  console.log(`Server running at http://${hostname}:${PORT}/`)
);
