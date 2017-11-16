import Queue from '../../queue';
import googleApi from '../../api/google-places';
import screenshotApi from '../../api/screenshots';
import bus from '../../bus';
import Id from '../../id';

const queue = Queue;

const errorMessages = [
  {
    msg: 'ZERO_RESULTS',
    translated: 'No results found! Try searching for something else?',
  },
  {
    msg: 'OVER_QUERY_LIMIT',
    translated: 'Looks like we\'re not paying Google enough...',
  },
  {
    msg: 'REQUEST_DENIED',
    translated: 'Request denied by Google!',
  },
  {
    msg: 'INVALID_REQUEST',
    translated: 'Whoops, something\'s wrong...',
  },
];

const state = {
  sites: [],
  error: false,
  detailsLoadedNum: 0,
};

const mutations = {
  saveSites(context, sites) {
    state.sites = state.sites.concat(sites);
  },
  updateSite(context, data) {
    const index = state.sites.findIndex(site => site.place_id === data.place_id);
    if (index !== -1) {
      state.sites[index] = Object.assign(state.sites[index], data);
    }
  },
  clearData() {
    state.sites = [];
    state.error = false;
    state.detailsLoadedNum = 0;
  },
  displayError(context, data) {
    const msgIndex = errorMessages.findIndex(error => error.msg === data);
    if (msgIndex !== -1) {
      state.error = errorMessages[msgIndex].translated;
    } else {
      state.error = 'Something bad happened, but we don\'t know why...';
    }
  },
  updateDetailsLoaded() {
    state.detailsLoadedNum += 1;
  },
};

const actions = {
  getSites(context, params) {
    Id.set();
    const id = Id.get();
    queue.queue = [];
    bus.$on('sitesLoaded', (data) => {
      data.map((obj) => {
        const element = obj;
        element.website = false;
        element.img = false;
        return obj;
      });
      context.commit('saveSites', data);
      data.forEach((element) => {
        context.dispatch('getSiteDetails', { place_id: element.place_id });
      });
    });
    return new Promise((resolve) => {
      googleApi.getPlaces(id, params).then(() => {
        resolve();
      }, (error) => {
        console.log(error);
        context.commit('displayError', error);
      });
    });
  },
  getSiteDetails(context, data) {
    queue.add(() => googleApi.getPlaceDetails(data.place_id)).then((response) => {
      context.commit('updateDetailsLoaded');
      if (response.website !== undefined) {
        context.commit('updateSite', response);
        context.dispatch('getScreenshot', response);
      }
    });
  },
  getScreenshot(context, data) {
    const item = data;
    screenshotApi.getScreenshot(data.website).then((response) => {
      item.img = URL.createObjectURL(response.data);
      context.commit('updateSite', item);
    }, (error) => {
      console.log(error);
    });
  },
  clear(context) {
    Id.clear();
    queue.queue = [];
    context.commit('clearData');
    bus.$off('sitesLoaded');
  },
};

const getters = {
  getSites() {
    return state.sites;
  },
  searchComplete() {
    return state.detailsLoadedNum === state.sites.length;
  },
  getError() {
    return state.error;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
