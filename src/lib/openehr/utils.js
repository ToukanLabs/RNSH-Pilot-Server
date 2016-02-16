import OpenEHR from '../openehr';

class URLQueryStringBuilder {
  constructor () {
    this.queryString = '';
  }

  addParam = (name, value) => {
    let separator = '&';
    if (this.queryString === '') {
      separator = '?';
    }

    this.queryString = `${this.queryString}${separator}${name}=${value}`;
  };

  getQueryString = () => {
    return this.queryString;
  };
}

function flattenAdditionalPartyInfo (additionalPartyInfo) {
  var flattened = {};
  for (var i in additionalPartyInfo) {
    flattened[additionalPartyInfo[i].key] = additionalPartyInfo[i].value;
  }

  return flattened;
}

// Archetype mapping functions
function openEHRPartyToPatient (partyJson) {
  const additionalPartyInfo = flattenAdditionalPartyInfo(partyJson.partyAdditionalInfo);
  return {
    id: partyJson.id,
    mrn: additionalPartyInfo['rnsh.mrn'],
    dob: partyJson.dateOfBirth,
    firstname: partyJson.firstNames,
    surname: partyJson.lastNames,
    address: partyJson.address.address,
    phone: additionalPartyInfo.phone,
    email: additionalPartyInfo.email,
    gender: partyJson.gender,
    tumorType: additionalPartyInfo.tumorType,
    surgical: additionalPartyInfo.surgical,
    allergies: [
      {name: 'Insulin', date: '2005-07-16'},
      {name: 'Penicillin', date: '2005-07-16'},
      {name: 'Dust', date: '1982-03-21'},
      {name: 'Latex', date: '1986-11-02'}
    ]
  };
}

export { URLQueryStringBuilder as URLQueryStringBuilder };
export { flattenAdditionalPartyInfo as flattenAdditionalPartyInfo };
export { openEHRPartyToPatient as openEHRPartyToPatient };
