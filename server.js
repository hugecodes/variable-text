const express = require('express');
const fs = require('fs');
const https = require('https');
const http = require('http');
const app = express();

app.use(express.static('public'));

var options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.cert')
};

https.createServer(options, app).listen(443);

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${ server.address().port }`);
});
