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

export { URLQueryStringBuilder as URLQueryStringBuilder };
