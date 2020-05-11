const express = require('express')
const http = require('http')
const fs = require('fs')
const app = express()
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies

var data = {};
var senddata = [];

app.use('/static', express.static('static'));

app.get('/query', (req, res) => {
  //console.log(senddata);
  res.send(JSON.stringify(senddata));
  senddata = [];
  //fs.writeFileSync("./export" + PS + ".csv", csvData, 'utf8')
})

app.post('/score', (req, res) => {
  //console.log(req.params);
  //console.log(req.body);
  var user = req.body.user;
  var score = req.body.score;
  if (score !== undefined) {
    score = parseInt(score);
  }
  if (user in data) {
    let obj = data[user]
    if (obj.score < score) {
      obj.score = score;
      senddata.push({user: user, score: score})
    }
    obj.playCount += 1
  }
  else {
    let obj = {score: score, playCount: 1};
    data[user] = obj;
    senddata.push({user: user, score: score})
  }
  //data.push({user: user, score: score});
  //senddata.push({user: user, score: score});
  writeToFile();
  res.send("Success");
})

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}


function getCache() {
  fs.readFile("savefile.txt", function(err, dx) {
    if (err) {
      data = {};
      senddata = [];
      writeToFile();
    }
    else {
      try {
        data = JSON.parse(dx);
        for (let id in data) {
          let obj = data[id];
          senddata.push({user: id, score: obj['score']})
        }
        //senddata = Object.assign(data);
      } catch (err) {
        data = {};
        senddata = [];
        writeToFile();
      }
      
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
var server = http.createServer(app);
//var server = http.createServer(app);
server.listen(3005);
console.log('Serving Do you even math on https://localhost:3005');