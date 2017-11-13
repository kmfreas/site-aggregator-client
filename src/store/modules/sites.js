import googleApi from '../../api/google-places';
import screenshotApi from '../../api/screenshots';

const perPage = 9;

const state = {
  sites: [],
  page: 1,
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
        response.forEach((element) => {
          const thisElement = element;
          thisElement.website = null;
          thisElement.img = null;
        });
        context.commit('saveSites', response);
        resolve();
      });
    });
  },
  getSiteDetails(context) {
    for (let x = 0; x < state.page * perPage; x += 1) {
      googleApi.getPlaceDetails(state.sites[x]).then((details) => {
        if (details.website !== undefined) {
          context.commit('updateSite', details);
          context.dispatch('getScreenshot', details);
        } else {
          context.commit('removeSite', details);
        }
      });
    }
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
