const express = require('express')
const http = require('http')
const fs = require('fs')
const app = express()
var bodyParser = require('body-parser');

var score = [];

function getCache() {
  for (var i = 0; i < 35; i++) {
    score.push(0);
  }
  fs.readFile("savefile.txt", function(err, dx) {
    let data = JSON.parse(dx);
    for (let id in data) {
      let obj = data[id];
      score[obj.score] += 1;
    }
    for (let i = 0; i < 35; i++) {
      console.log(score[i] + " ");
    }
  });
}

function writeToFile() {
  fs.writeFile("savefile.txt", JSON.stringify(data, null, 2), (err) => {  
    if (err) throw err;
    //console.log('Saved!');
  });
}

/*var options = {
  key: fs.readFileSync('/etc/letsencrypt/live/cs2040.codecla.ws/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/cs2040.codecla.ws/cert.pem'),
  ca: fs.readFileSync('/etc/letsencrypt/live/cs2040.codecla.ws/chain.pem')
};*/
getCache();
//var server = http.createServer(app);
//var server = http.createServer(app);
//server.listen(3005);
//console.log('Serving Do you even math on https://localhost:3005');