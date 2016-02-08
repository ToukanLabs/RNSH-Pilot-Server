var state = require('./initialState');

function fetchPatient (patientId) {
  var patient = state.initialState.patients.filter((p) => {
    if (p.id === parseInt(patientId, 10)) {
      return p;
    }
  })[0];

  return patient;
};

module.exports.fetchPatient = fetchPatient;
