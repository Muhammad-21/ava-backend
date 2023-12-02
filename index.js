const bodyParser = require('body-parser');
const textToSpeech = require('./sdk');
const cors = require('cors');
const { default: axios } = require('axios');
const https = require('https');
const gigaReq = require('./req');
const express = require('express');
const app = require('express')();

// const host = '127.0.0.1';
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'))

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

app.post('/talk', (req, res) => {

  const httpsAgent = new https.Agent({
    rejectUnauthorized: false,
  })
  axios.defaults.httpsAgent = httpsAgent

  gigaReq(req.body.text).then(response => {
    textToSpeech(response.data.choices[0].message.content, req.body.language)
        .then(result => {
          res.json(result);    
        })
        .catch(err => {
          res.json(err);
        })
  })
})

app.listen(port, function () {
    console.log(`Server listens ${port}`);
});