
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const hbase = require("hbase");

const PORT = 7000;
const client = hbase({ host: "127.0.0.1", port: 8080 });

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());


app.get("/t1", (req, res) => {
    let result;
    client.table("gresse_word_pop").scan(
      {
        batch: 100,
      },
      function (err, rows) {
        result = {};
        if (err) {
          console.error(err);
          res.status(400).send(err);
          return;
        }
        result["words"] = [];
        rows.forEach((element) => {
          if (!result[element.key]) {
            result[element.key] = [];
          }
          if (!result["words"].includes(element.key)) {
            result["words"].push(element.key);
          }
          const obj = {};
          obj.date = element.column.split(":")[1];
          obj.total = element.$;
          result[element.key].push(obj);
        });
        console.log(result);
        res.status(200).send(result);
        if (err) {
          res.sendStatus(500);
        }
      }
    );
  });
  

app.get("/", (req, res) => res.status(400).send("Welcome 👌!"));

app.listen(PORT, () => console.log("Server Listening"));
