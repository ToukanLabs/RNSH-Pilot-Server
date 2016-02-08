'use strict';

var state = require('./initialState');

function fetchPatient(patientId) {
  var patient = state.initialState.patients.filter(function (p) {
    if (p.id === parseInt(patientId, 10)) {
      return p;
    }
  })[0];

  return patient;
};

module.exports.fetchPatient = fetchPatient;