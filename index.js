const express = require('express');
const path = require('path');
let socket = require('socket.io');
const cron = require("node-cron");
const fetch = require('node-fetch');
const compression = require('compression');
const http = require("http");
const bodyParser = require('body-parser');
const app = express();
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let json = require('./config.json');

const twitchKey = json.twitchKey;

let streamArray = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.use('/static', express.static('public'));

app.get('/api/v1/data', (req, res) => {
  res.status(200).send(streamArray)
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(`${__dirname}/client/build/index.html`));
});

const port = process.env.PORT || 1530;
/*
app.listen(port, function(){
  console.log(`server is running on port ${port}`)
})
*/
/*======================================
=           SOCKET IO           =
======================================*/
const server = http.createServer(app);
const io = socket(server);

io.on('connection', (socket) => {
  setInterval(() => {
    socket.emit('twitchstuff', streamArray);
  }, 60 * 1000);
});

server.listen(port, () => console.log(`Listening on port ${port}`));
/*======================================
=                TWITCH               =
======================================*/

/*rate limit is 120 requests per minute*/
/*each below request is 1 request per minute*/
const fetchTwitchLive = () => {
  fetch(`https://api.twitch.tv/kraken/streams?channel=213748641,447330144,83402203,26261471,159498717,22484632,195166073,407881598,124420521,91137296,26946000,123782776,115659124,37522866,234973404,11249217,30777889,127550308,252393390,70661496,124494583,40990240,216233870,44445592,500128827,61433001,38746172,78397626&client_id=${twitchKey}`,
    {headers: { 'Accept': 'application/vnd.twitchtv.v5+json' },})
    .then(res => res.json())
    .then(body => {
      streamArray = body.streams
    }
  )
  .catch(error => {
    console.log(error);
  });
}

cron.schedule("* * * * *", function() {
  fetchTwitchLive();
});

fetchTwitchLive();
