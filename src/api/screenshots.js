import axios from 'axios';

const endpoint = process.env.NODE_ENV === 'development' ? 'http://localhost:3100/screenshot/' : 'http://rendertron.krez.me/screenshot/';

export default {
  endpoint,
  getScreenshot(url) {
    return axios({
      method: 'get',
      url: this.endpoint + encodeURIComponent(url),
      responseType: 'blob',
      params: {
        width: 1400,
        height: 1400,
      },
    });
  },
};
