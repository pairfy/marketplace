const express = require('express');
const app = express();
const port = 3000;

app.get('/healthcheck', (req, res) => {
  res.send('OK');
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
