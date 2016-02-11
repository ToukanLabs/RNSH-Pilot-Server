import OpenEHR from '../lib/openehr';
import { openEHRPartyToPatient } from '../lib/openehr/utils';
import fetch from 'isomorphic-fetch';

const code4health = new OpenEHR(
  'https://ehrscape.code-4-health.org/rest/v1/',
  'rnsh.mrn',
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

function addPatient (req, res) {
  code4health.createParty(req.body.firstNames, req.body.lastNames, req.body.gender, req.body.dateOfBirth,
    req.body.address, req.body.mrn, req.body.tumorType, req.body.isSurgical, req.body.phone, req.body.email, (json) => {
      console.log(json.meta.href);
      const url = json.meta.href;
      const options = {
        headers: {
          'Authorization': code4health.getAuthorizationHeader()
        },
      };
      fetch(url, options)
        .then(function (response) {
          if (response.status >= 400) {
            console.log(response);
            throw new Error('Bad response from server');
          }
          return response.json();
        })
        .then(function (json) {
          res.json(openEHRPartyToPatient(json.party));
        })
        .catch(function (ex) {
          console.log('parsing failed', ex);
        });
    });
}

module.exports.fetchPatient = fetchPatient;
module.exports.fetchAllPatients = fetchAllPatients;
module.exports.addPatient = addPatient;
