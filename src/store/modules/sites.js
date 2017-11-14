import Queue from 'promise-queue';
import googleApi from '../../api/google-places';
import screenshotApi from '../../api/screenshots';

const state = {
  sites: [],
};

const mutations = {
  saveSites(context, sites) {
    state.sites = state.sites.concat(sites);
  },
  updateSite(context, data) {
    const index = state.sites.findIndex(site => site.place_id === data.place_id);
    state.sites[index] = Object.assign(state.sites[index], data);
  },
  clearSites() {
    state.sites = [];
  },
  removeSite(context, data) {
    const index = state.sites.findIndex(site => site.place_id === data.place_id);
    state.sites.splice(index, 1);
  },
};

const actions = {
  getSites(context, params) {
    return new Promise((resolve) => {
      googleApi.getPlaces(params).then((response) => {
        const queue = new Queue(1, Infinity);
        response.forEach((element) => {
          const thisElement = element;
          thisElement.website = null;
          thisElement.img = null;
          context.dispatch('getSiteDetails', { id: element.place_id, queue });
        });
        context.commit('saveSites', response);
        resolve();
      });
    });
  },
  getSiteDetails(context, data) {
    data.queue.add(() => googleApi.getPlaceDetails(data.id)).then((response) => {
      if (response.website !== undefined) {
        context.commit('updateSite', response);
        context.dispatch('getScreenshot', response);
      } else {
        context.commit('removeSite', response);
      }
    });
  },
  getScreenshot(context, data) {
    const item = data;
    screenshotApi.getScreenshot(data.website).then((response) => {
      item.img = URL.createObjectURL(response.data);
      context.commit('updateSite', item);
    });
  },
};

const getters = {
  getSites() {
    const pageBreak = state.sites.findIndex(site => site.website === null);
    return state.sites.slice(0, pageBreak);
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
