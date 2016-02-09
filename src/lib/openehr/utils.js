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

export { URLQueryStringBuilder as URLQueryStringBuilder };
export { flattenAdditionalPartyInfo as flattenAdditionalPartyInfo };
