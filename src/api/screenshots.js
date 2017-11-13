import axios from 'axios';

export default {
  endpoint: 'http://localhost:8000/screenshot/',
  getScreenshot(url) {
    return axios({
      method: 'get',
      url: this.endpoint + encodeURIComponent(url),
      responseType: 'blob',
    });
  },
};
