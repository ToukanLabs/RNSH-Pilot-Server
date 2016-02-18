var express = require('express');
var router = express.Router();
var patient = require('./patients');
var wkhtmltopdf = require('wkhtmltopdf');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/patient/:patientId', function (req, res, next) {
  // res.send('Got a GET request for followup');
  patient.fetchPatient(res, req.params.patientId);
});

router.get('/patient', function (req, res, next) {
  patient.fetchAllPatients(res);
});

router.post('/patient', function (req, res, next) {
  patient.addPatient(req, res);
});

router.get('/download', function (req, res, next) {
  res.setHeader('Content-disposition', 'attachment; filename=test.pdf');
  res.setHeader('Content-type', 'application/pdf');
  wkhtmltopdf(req.body.pdfhtml).pipe(res);
});

module.exports = router;
