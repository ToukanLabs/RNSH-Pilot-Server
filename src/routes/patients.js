import OpenEHR from '../lib/openehr';
import { openEHRPartyToPatient } from '../lib/openehr/utils';
import fetch from 'isomorphic-fetch';
var wkhtmltopdf = require('wkhtmltopdf');
var fs = require('fs');
var btoa = require('btoa');
var os = require('os');
var request = require('request');

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
      if (json.status === 400 && json.code === 'EHR-2124') {
        res.status(400);
        res.json({
          status: 'error',
          message: 'A patient with this MRN already exists.'
        });
        return;
      }

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

function getDiagnosis (res, ehrId) {
  const aql = `select a/uid/value as uid_value, a/context/start_time/value as context_start_time from EHR e[ehr_id/value='${ehrId}'] contains COMPOSITION a[openEHR-EHR-COMPOSITION.health_summary.v1] where a/name/value= 'Prostate Cancer Summary' order by a/context/start_time/value desc offset 0 limit 1`;
  code4health.getAql(aql, (json) => {
    const compositionUid = json.resultSet[0].uid_value;
    code4health.getComposition(compositionUid, (compositionJson) => {
      const returnJson = {
        primary_tumour_pt: compositionJson.composition.prostate_cancer_summary.prostate_diagnosis[0].prostate_diagnosis[0].tumour_details[0]['tnm_stage_-_pathological'][0].primary_tumour_pt[0],
        regional_lymph_node_pn: compositionJson.composition.prostate_cancer_summary.prostate_diagnosis[0].prostate_diagnosis[0].tumour_details[0]['tnm_stage_-_pathological'][0].regional_lymph_node_pn[0],
        distant_metastasis_pm: compositionJson.composition.prostate_cancer_summary.prostate_diagnosis[0].prostate_diagnosis[0].tumour_details[0]['tnm_stage_-_pathological'][0].distant_metastasis_pm[0]
      };
      res.json(returnJson);
    });
  },
  (ex) => {
    if (ex.statusCode === 204) {
      const returnJson = {
        primary_tumour_pt: '',
        regional_lymph_node_pn: '',
        distant_metastasis_pm: ''
      };
      res.json(returnJson);
    } else {
      console.log('parsing failed', ex);
    }
  });
};

function addDiagnosis (req, res) {
  var date = new Date();
  const body = `{
  "ctx/composer_name": "DR Thilo Schuler",
  "ctx/health_care_facility|id": "999999-8561",
  "ctx/health_care_facility|name": "Royal North Shore Hospital",
  "ctx/id_namespace": "RNSH",
  "ctx/id_scheme": "2.16.840.1.113883.2.1.4.3",
  "ctx/language": "en",
  "ctx/territory": "AU",
  "ctx/time": "2016-02-25T13:01:12",
  "prostate_cancer_summary/_uid": "4e708baa-b918-47be-8929-5712d10ff64b::rnhspilot.c4h.ehrscape.com::1",
  "prostate_cancer_summary/context/_health_care_facility|id": "9091",
  "prostate_cancer_summary/context/_health_care_facility|id_scheme": "HOSPITAL-NS",
  "prostate_cancer_summary/context/_health_care_facility|id_namespace": "HOSPITAL-NS",
  "prostate_cancer_summary/context/_health_care_facility|name": "Hospital",
  "prostate_cancer_summary/context/start_time": "${date.toISOString()}",
  "prostate_cancer_summary/context/setting|code": "238",
  "prostate_cancer_summary/context/setting|value": "other care",
  "prostate_cancer_summary/context/setting|terminology": "openehr",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/problem_diagnosis_name": "Prostate cancer",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/date_time_clinically_recognised": "2016-01-28T17:42:14.051Z",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/severity|code": "at0047",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/severity|value": "Mild",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/severity|terminology": "local",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/tnm_stage_-_pathological:0/primary_tumour_pt": "${req.body.diagnosis.primary_tumour_pt}",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/tnm_stage_-_pathological:0/regional_lymph_node_pn": "${req.body.diagnosis.regional_lymph_node_pn}",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/tnm_stage_-_pathological:0/distant_metastasis_pm": "${req.body.diagnosis.distant_metastasis_pm}",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/tnm_stage_-_clinical:0/primary_tumour_ct": "T3",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/tnm_stage_-_clinical:0/regional_lymph_node_cn": "N0",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/tnm_stage_-_clinical:0/distant_metastasis_cm": "M1b",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/metastases_summary:0/present": true,
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/metastases_summary:0/per_metastasis_site/body_site": "Lumbar spine",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/tumour_details:0/metastases_summary:0/per_metastasis_site/date_clinically_recognised": "2015-12-22T17:42:14.051Z",
  "prostate_cancer_summary/prostate_diagnosis/prostate_diagnosis/last_updated": "2016-01-28T17:42:14.051Z",
  "prostate_cancer_summary/treatment_intent/goal:0/treatment_intent": "Palliative",
  "prostate_cancer_summary/treatment_intent/goal:0/goal_start_date": "2015-12-28T17:42:14.051Z",
  "prostate_cancer_summary/treatment_intent/goal:0/last_updated": "2016-01-28T17:42:14.051Z",
  "prostate_cancer_summary/management/radiation_therapy_summary/treatment_name": "Radiation therapy",
  "prostate_cancer_summary/management/radiation_therapy_summary/episode:0/episode_onset": "2015-11-28T17:42:14.052Z",
  "prostate_cancer_summary/management/radiation_therapy_summary/last_updated": "2016-01-28T17:42:14.052Z",
  "prostate_cancer_summary/management/hormone_therapy_summary/medication_name": "Hormone Therapy",
  "prostate_cancer_summary/management/hormone_therapy_summary/current_use": true,
  "prostate_cancer_summary/management/hormone_therapy_summary/episode:0/episode_onset": "2015-12-28T17:42:14.052Z",
  "prostate_cancer_summary/management/hormone_therapy_summary/episode:0/clinical_indication": "Relapse",
  "prostate_cancer_summary/management/hormone_therapy_summary/episode:0/intent": "Curative",
  "prostate_cancer_summary/management/hormone_therapy_summary/episode:0/episode_cessation": "2016-01-28T17:42:14.052Z",
  "prostate_cancer_summary/management/hormone_therapy_summary/cessation_of_use": "2016-01-28T17:42:14.052Z",
  "prostate_cancer_summary/management/hormone_therapy_summary/last_updated": "2016-01-28T17:42:14.052Z",
  "prostate_cancer_summary/management/abiraterone_enzalutamide_summary/medication_name": "Abiraterone/Enzalutamide",
  "prostate_cancer_summary/management/abiraterone_enzalutamide_summary/current_use": true,
  "prostate_cancer_summary/management/abiraterone_enzalutamide_summary/last_updated": "2016-01-28T17:42:14.052Z",
  "prostate_cancer_summary/management/alpha_blocker_anticholinergic_summary/medication_name": "Alpha Blocker/Anticholinergic",
  "prostate_cancer_summary/management/alpha_blocker_anticholinergic_summary/current_use": true,
  "prostate_cancer_summary/management/alpha_blocker_anticholinergic_summary/last_updated": "2016-01-28T17:42:14.052Z",
  "prostate_cancer_summary/management/chemotherapy_summary/medication_name": "Chemotherapy",
  "prostate_cancer_summary/management/chemotherapy_summary/current_use": false,
  "prostate_cancer_summary/management/chemotherapy_summary/last_updated": "2016-01-28T17:42:14.053Z",
  "prostate_cancer_summary/composer|name": "Thilo Schuler"
}`;
  code4health.saveComposition('2016 01 Prostate Cancer Summary', req.params.ehrId, body, (json) => {
    res.json(json);
  });
};

function sendAria (req, res) {
  console.log(req.body.pdfhtml);
  const d = new Date().toISOString();
  const dateOfServiceSlug = d.replace(/:/g, '--');
  var outFile = `${os.tmpdir()}/out_${dateOfServiceSlug}.pdf`;
  wkhtmltopdf(req.body.pdfhtml, { output: outFile }, function (code, signal) {
    fs.readFile(outFile, (err, data) => {
      if (err) {
        return console.log(err);
      }
      var base64data = new Buffer(data).toString('base64');
      const body = {
        'BinaryContent': base64data,
        'FileFormat': 'PDF',
        'DateOfService': '2016-02-09T11:01:12'
      };
      const url = `${process.env.ARIA_API_URL}/${btoa('#' + req.body.mrn)}/Document`;

      request({
        method: 'POST',
        'rejectUnauthorized': false,
        'url': url,
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `${process.env.ARIA_AUTH_CODE}`
        },
        'body': body,
        'json': true,
      },
      (error, response, body) => {
        if (error) {
          console.log('parsing failed', error);
        }
        res.json(body);
      });
    });
  });
};

module.exports.fetchPatient = fetchPatient;
module.exports.fetchAllPatients = fetchAllPatients;
module.exports.addPatient = addPatient;
module.exports.sendAria = sendAria;
module.exports.addDiagnosis = addDiagnosis;
module.exports.getDiagnosis = getDiagnosis;
