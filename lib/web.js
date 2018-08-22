const express = require('express')
const app = express()
const _ = require('lodash')
var request = require('request');
var qs = require('querystring')

app.all('/ratetest', function(req, res) {
  var options = {
    url : req.query.url + "/"+ req.query.path,
    method : req.method,
    json : true,
    headers: {
      'Metadata' : 'true'
  },
  qs: {resource: req.query.resource, "api-version": req.query.apiversion}
  //body : {'resource': req.params["resource"]}
};
  request(options, function(error, response){
   console.log(error);
   res.status(response.statusCode).send(response)
  });
});

app.all('*', function(req, res) {

  let responseMsgs = [`[Response from ${req.hostname}]`]
  let consoleMsgs  = [`Request from ${req.ip}`]

  let delayMsecs = parseInt(req.query.d) || 0
  let variance = parseInt(req.query.r) || 0

  if (variance) {
    let value = _.random(0,variance)
    delayMsecs = delayMsecs + value

    let randMsg = `adding ${value}s random delay (max ${variance}s)`
    responseMsgs.push(randMsg)
    consoleMsgs.push(randMsg)
  } // if variance

  let empty = !!req.query.e;
  let delayMsg = delayMsecs ? `delayed ${delayMsecs}ms` : 'not delayed'

  responseMsgs.push(delayMsg)
  consoleMsgs.push(delayMsg)
  consoleMsgs.push(empty ? 'prematurely breaking connection' : 'completing normally')

  let output = () => {
    if (empty) {
      return res.socket.end()
    }
    res.end(responseMsgs.join('\n\t- ') + '\n')
  }

  console.log(consoleMsgs.join(', '))
  setInterval(output, delayMsecs)
});

// catch 404 and forward to error handler
app.use(function(req, res) {
  res.sendStatus(404)
});

module.exports = app
