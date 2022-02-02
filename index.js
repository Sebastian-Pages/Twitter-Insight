const express = require("express");
const morgan = require("morgan");
var parseString = require('xml2js').parseString;

const PORT = 3008;
const hostname = "127.0.0.1";

const app = express();
app.use(morgan("combined"));
app.set('view engine', 'ejs');

app.get('/hashtags', (req, res) => {
  
    res.render('pages/hashtags',{ 
      name: "",
      count: ""
    });
    
});

app.get('/hashtags/:hashtag', (req, res) => {
  var exec = require('child_process').exec;

  var args = " -X GET -H Accept: application/json --negotiate -u: \ http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:test3/"+req.params.hashtag ;

  exec('curl ' + args, function (error, stdout, stderr) {
    parseString(stdout, function (err, result) {
      res.render('pages/hashtags',{ 
        name: result.CellSet,
        count: JSON.stringify(result)
      });
    });
    
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
  
});

app.get('/users', (req, res) => {
  var exec = require('child_process').exec;

  var args = "-H 'Content-Type: application/json' https://next-js-project-manager.vercel.app/api/project";

  exec('curl ' + args, function (error, stdout, stderr) {
    res.render('pages/users',{ 
      tagline: stdout,
    });
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
});

// app.get('/influenceurs', (req, res) => {
//   var exec = require('child_process').exec;

//   var args = "-H 'Content-Type: application/json' https://next-js-project-manager.vercel.app/api/project";

//   exec('curl ' + args, function (error, stdout, stderr) {
//     res.render('pages/influenceurs',{ 
//       tagline: stdout,
//     });
//     console.log('stdout: ' + stdout);
//     console.log('stderr: ' + stderr);
//     if (error !== null) {
//       console.log('exec error: ' + error);
//     }
//   });
// });

app.get("/", (req, res) =>
  res.render('pages/index')
);

//API

app.get('/api/hashtagcount/:name', (req, res) => {
  var exec = require('child_process').exec;

  var args = " -X GET -H Accept: application/json --negotiate -u: \ http://lsd-prod-namenode-0.lsd.novalocal:8080/ypages:test3/"+req.params.name ;

  exec('curl ' + args, function (error, stdout, stderr) {
    parseString(stdout, function (err, result) {
      res.json(result);
    });
    
    console.log('stdout: ' + stdout);
    console.log('stderr: ' + stderr);
    if (error !== null) {
      console.log('exec error: ' + error);
    }
  });
  
});


app.listen(PORT, hostname, () =>
  console.log(`Server running at http://${hostname}:${PORT}/`)
);