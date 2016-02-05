var express = require('express');
var router = express.Router();
var patient = require('./patients');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/patient/:patientId', function(req, res, next) {
  //res.send('Got a GET request for followup');
  var newPatient = patient.fetchPatient(req.params.patientId);
  res.json(newPatient);
});

module.exports = router;
