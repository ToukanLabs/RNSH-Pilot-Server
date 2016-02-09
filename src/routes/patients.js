import OpenEHR from '../lib/openehr';
import { openEHRPartyToPatient } from '../lib/openehr/utils';

const code4health = new OpenEHR(
  'https://ehrscape.code-4-health.org/rest/v1/',
  'rnshpilot_c4h',
  'lIsombRI'
);

function fetchPatient (res, patientId) {
  code4health.getParty(patientId, (patientJson) => {
    res.json(openEHRPartyToPatient(patientJson));
  });
};

function fetchAllPatients (res) {
  code4health.allParties((json) => {
    // handle response, e.g.
    const patients = json.map((p) => {
      return openEHRPartyToPatient(p);
    });
    res.json(patients);
  });
}

module.exports.fetchPatient = fetchPatient;
module.exports.fetchAllPatients = fetchAllPatients;
