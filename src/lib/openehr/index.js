import es6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';
import { URLQueryStringBuilder } from './utils';

es6Promise.polyfill();

class OpenEHR {
  static get Genders() {
    return {
      MALE: 'MALE',
      FEMALE: 'FEMALE'
    };
  }

  constructor (openEhrUrl, username, password) {
    this.endpoints = {
      demographic: 'demographics',
      party: 'demographics/party',
    };

    // Strip the terailing slash if its supplied.
    this.baseUrl = (openEhrUrl.endsWith('/')) ? openEhrUrl.replace(/\/$/, '') : openEhrUrl;
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

  getOpenEhr = (urlEndpoint, callback) => {
    const url = `${this.baseUrl}/${urlEndpoint}`;

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

  postOpenEhr = (urlEndpoint, body, callback) => {
    const url = `${this.baseUrl}/${urlEndpoint}`;

    const options = {
      method: 'post',
      headers: {
        'Authorization': this.getAuthorizationHeader(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
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

  allParties = (callback) => {
    const url = `${this.endpoints.party}/query/?lastNames=*&rnsh.mrn=*`;
    this.getOpenEhr(url, (json) => {
      callback(json.parties);
    });
  };

  searchParties = (searchTerm, callback) => {
    const url = `${this.endpoints.party}/query/?search=*${searchTerm}*&rnsh.mrn=*`;

    this.getOpenEhr(url, (json) => {
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
      queryStringBuilder.addParam('rnsh.mrn', `*${mrn}*`);
    }

    const queryString = queryStringBuilder.getQueryString();
    const url = `${this.endpoints.party}/query/${queryString}`;

    this.getOpenEhr(url, (json) => {
      callback(json.parties);
    });
  };

  getParty = (partyId, callback) => {
    const url = `${this.endpoints.party}/${partyId}`;

    this.getOpenEhr(url, (json) => {
      callback(json.party);
    });
  };

  createParty = (firstNames, lastNames, gender, dateOfBirth, address, mrn, tumorType, isSurgical, phone, email, callback) => {
    const url = `${this.endpoints.party}`;

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

    this.postOpenEhr(url, partyBody, (json) => {
      callback(json);
    });
  };
}

export default OpenEHR;
