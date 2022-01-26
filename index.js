// const express = require("express");
// const morgan = require("morgan");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const hbase = require("hbase");

// const PORT = 7000;
// const hostname = "127.0.0.1";
// const client = hbase({ host: "http://lsd-prod-namenode-0.lsd.novalocal", port: 8080 });
// const options = {
//   hostname: 'http://lsd-prod-namenode-0.lsd.novalocal',
//   port: 8080,
//   path: '/ypages:t1/0',
//   method: 'GET'
// }

// const app = express();
// app.use(morgan("combined"));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(cors());


// app.get('/t1', (req, res) => {
//   const scanner = client
//       .table('ypages:t1')
//       .scan({
//           startRow: '0',
//       })

//   const rows = []

//   scanner.on('readable', () => {
//       let max = 0
//       let chunk

//       while ((chunk = scanner.read()) && max < req.params.batch) {
//           rows.push(chunk)
//           max++
//       }
//       scanner.emit('end', null);
//   })

//   scanner.on('error', err =>
//       res.sendStatus(404)
//   )

//   scanner.on('end', () =>
//       res.json(rows)
//   )
// });

// app.get("/", (req, res) =>
//   res.status(400).send("Welcome To Twitter Insight 🐦")
// );

// app.listen(PORT, hostname, () =>
//   console.log(`Server running at http://${hostname}:${PORT}/`)
// );

const axios = require('axios');

axios.get('http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:t1/0')
  .then(result => {
    console.log(result.data);
  })
  .catch(error => {
    console.log(error)
  });