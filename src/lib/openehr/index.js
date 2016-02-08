import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { URLQueryStringBuilder } from './utils';

es6Promise.polyfill();

class OpenEHR {
  constructor (openEhrUrl, username, password) {
    this.endpoints = {
      demographic: 'demographics/',
    };

    this.baseUrl = (openEhrUrl.endsWith('/')) ? openEhrUrl : `${openEhrUrl}/`;
    this.username = username;
    this.password = password;
  }

  getAuthorizationHeader = () => {
    if (!this.authorizationHeader) {
      const base64Credentials =
          new Buffer(`${this.username}:${this.password}`).toString('base64');
      this.authorizationHeader = `Basic ${base64Credentials}`;
    }
    return this.authorizationHeader;
  };

  fetchOpenEhr = (urlEndpoint, callback) => {
    const url = `${this.baseUrl}${urlEndpoint}`;

    const options = {
      headers: {
        'Authorization': this.getAuthorizationHeader()
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
        callback(json);
      })
      .catch(function (ex) {
        console.log('parsing failed', ex);
      });
  };

  /*
    Fetches a list of all parties (i.e. patients) from OpenEHR.
    Response is of the form:

    parties: [{
    "id": "7574",
      "version": 0,
      "firstNames": "Leslie",
      "lastNames": "Sampson",
      "gender": "MALE",
      "dateOfBirth": "1971-06-25T00:00:00.000Z",
      "address": {
        "id": "7574",
        "version": 0,
        "address": "Ap #408-5503 Vivamus Rd., Penzance, Cornwall, EB7K 8ZF"
      },
      "partyAdditionalInfo": [
        {
          "id": "7576",
          "version": 0,
          "key": "title",
          "value": "Mr"
        },
        {
          "id": "7575",
          "version": 0,
          "key": "uk.nhs.nhs_number",
          "value": "9999999010"
        }
      ]
    }, ...]
  */
  allParties = (callback) => {
    const url = `${this.endpoints.demographic}party/query/?lastNames=*`;
    this.fetchOpenEhr(url, (json) => {
      callback(json.parties);
    });
  };

  searchParties = (searchTerm, callback) => {
    const url = `${this.endpoints.demographic}party/query/?search=*${searchTerm}*`;

    this.fetchOpenEhr(url, (json) => {
      callback(json.parties);
    });
  };

  findParties = (firstNames, lastNames, mrn, callback) => {
    let queryStringBuilder = new URLQueryStringBuilder();

    if (firstNames && firstNames !== '') {
      queryStringBuilder.addParam('firstNames', `*${firstNames}*`);
    }

    if (lastNames && lastNames !== '') {
      queryStringBuilder.addParam('lastNames', `*${lastNames}*`);
    }

    if (mrn && mrn !== '') {
      queryStringBuilder.addParam('uk.nhs.nhs_number', `*${mrn}*`);
    }

    const queryString = queryStringBuilder.getQueryString();
    const url = `${this.endpoints.demographic}party/query/${queryString}`;

    this.fetchOpenEhr(url, callback);
  };
}

export default OpenEHR;
