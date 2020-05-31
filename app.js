// Installed modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const parser = require('body-parser');

// Constants
const PORT = 8080;
const ADDRESS = 'localhost';

const app = express();

app.use(parser.urlencoded({extended: true}));
app.use(express.static(path.join("public")));

app.get('/index', (req, res) => {
  let doc = fs.readFileSync("./public/html/index.html", "utf-8");
  res.send(doc);
});

app.get('/map', (req, res) => {
  let doc = fs.readFileSync("./public/html/maps.html", "utf-8");
  res.send(doc);
});

app.get('/', (req, res) => {
  let doc = fs.readFileSync("./public/html/brian_index.html", "utf-8");
  res.send(doc);
});


// app.get('/ajax-GET-list', function (req, res) {

//   let formatOfResponse = req.query['format']; 
//   let dataList = null;

//   // Given a query format = html-table, returns HTML data
//   if(formatOfResponse == 'json-table') {
//       res.setHeader('Content-Type', 'text/html');
//       dataList = tables.getJSON();
//       res.send(dataList);
//   } else {
//       res.send({msg: 'Wrong format!'});
//   }
// });



app.listen(PORT, ADDRESS, () => {
  console.log(`Listening on ${ADDRESS}:${PORT}`);
})