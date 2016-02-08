'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var express = require('express');
var router = express.Router();
var patient = require('./patients');

var MyClass = function () {
  function MyClass() {
    _classCallCheck(this, MyClass);
  }

  _createClass(MyClass, [{
    key: 'render',
    value: function render() {
      console.log('render');
    }
  }]);

  return MyClass;
}();

/* GET home page. */


router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/patient/:patientId', function (req, res, next) {
  //res.send('Got a GET request for followup');
  var newPatient = patient.fetchPatient(req.params.patientId);
  res.json(newPatient);
});

module.exports = router;