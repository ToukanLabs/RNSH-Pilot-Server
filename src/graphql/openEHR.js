import fetch from 'isomorphic-fetch';
// import PatientsList from './data/patients';
import OpenEHR from '../lib/openehr';
import { openEHRPartyToPatient } from '../lib/openehr/utils';

const baseUrl = 'https://ehrscape.code-4-health.org/rest/v1/';
const subjectNamespace = 'rnsh.mrn';
/* const username = 'rnshpilot_c4h';
const password = 'lIsombRI'; */

const code4health = new OpenEHR(
  'https://ehrscape.code-4-health.org/rest/v1/',
  'rnsh.mrn',
  'rnshpilot_c4h',
  'lIsombRI'
);

const getOpenEhr = (url, callback) => {
  const options = {
    headers: {
      'Authorization': code4health.getAuthorizationHeader()
    },
  };
  return fetch(url, options)
    .then((response) => {
      if (!response.ok || response.status === 204) {
        let error = new Error('Bad response from server');
        error.statusCode = response.status;
        throw error;
      }
      return response.json();
    })
    .then((json) => {
      return callback(json);
    })
    .catch((ex) => {
      console.log('parsing failed', ex);
      throw ex;
    });
};

const postOpenEhr = (url, body, callback) => {
  let options = {
    method: 'post',
    headers: {
      'Authorization': code4health.getAuthorizationHeader(),
      'Accept': 'application/json'
    }
  };

  if (body !== null) {
    options.body = body;
    options.headers['Content-Type'] = 'application/json';
  }
  return fetch(url, options)
    .then(function (response) {
      // TODO this is dodgy a 400 is not an acceptable return to continue on with
      if (response.status >= 400) {
        return response.text();
      }
      return response.json();
    })
    .then((json) => {
      return callback(json);
    })
    .catch((ex) => {
      console.log('parsing failed', ex);
      throw ex;
    });
};

const addPatient = async (firstNames, lastNames, gender, dateOfBirth, address, mrn, tumorType, isSurgical, phone, email) => {
  const partyBody = {
    firstNames: firstNames,
    lastNames: lastNames,
    gender: gender,
    dateOfBirth: dateOfBirth,
    address: {
      address: address
    },
    partyAdditionalInfo: [
      {
        key: 'rnsh.mrn',
        value: mrn
      },
      {
        key: 'tumorType',
        value: tumorType
      },
      {
        key: 'surgical',
        value: isSurgical
      },
      {
        key: 'phone',
        value: phone
      },
      {
        key: 'email',
        value: email
      }
    ]
  };
  //  Create a new EHR Record for the MRN before creating a new patient
  let url = `${baseUrl}ehr/?subjectId=${mrn}&subjectNamespace=${subjectNamespace}`;
  let ehrResponseJson;
  await postOpenEhr(url, null, (ehrResponse) => {
    try {
      var jsonResponse = JSON.parse(ehrResponse);
      ehrResponseJson = jsonResponse;
    } catch (e) {
      ehrResponseJson = ehrResponse;
    }
  });
  if (ehrResponseJson.status === 400 && ehrResponseJson.code === 'EHR-2124') {
    let error = new Error('A patient with this MRN already exists.');
    throw error;
  }

  // Create a new Patient record AKA party
  url = `${baseUrl}demographics/party`;
  await postOpenEhr(url, JSON.stringify(partyBody), (partyResponseJson) => {
    if (partyResponseJson.status === 400 && partyResponseJson.code === 'EHR-2124') {
      let error = new Error('A patient with this MRN already exists.');
      throw error;
    }
    url = partyResponseJson.meta.href;
  });

  // Get the new patient we just created and return it
  let newPatient;
  await getOpenEhr(url, (json) => {
    newPatient = openEHRPartyToPatient(json.party);
    console.log(newPatient);
  });
  return newPatient;
};

export { addPatient as addPatient };
export { getOpenEhr as getOpenEhr };
export { postOpenEhr as postOpenEhr };
export { baseUrl as openEHRBaseUrl };
export { subjectNamespace as subjectNamespace };
