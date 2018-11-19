const express = require('express');
const app = express();

app.use(express.static('public'));

const server = app.listen(process.env.PORT || 4000, () => {
  console.log(`Listening on port ${ server.address().port }`);
});
