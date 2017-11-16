import Queue from '../../queue';
import googleApi from '../../api/google-places';
import screenshotApi from '../../api/screenshots';
import bus from '../../bus';

let getSitesCalled = false;
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
};

const actions = {
  getSites(context, params) {
    context.commit('clearSites');
    if (!getSitesCalled) {
      bus.$on('sitesLoaded', (data) => {
        data.map((obj) => {
          const element = obj;
          element.website = false;
          element.img = false;
          return obj;
        });
        context.commit('saveSites', data);
        data.forEach((element) => {
          context.dispatch('getSiteDetails', element.place_id);
        });
      });
      getSitesCalled = true;
    }
    return new Promise((resolve) => {
      googleApi.getPlaces(params).then(() => {
        resolve();
      });
    });
  },
  getSiteDetails(context, id) {
    Queue.add(() => googleApi.getPlaceDetails(id)).then((response) => {
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
};

const getters = {
  getSites() {
    return state.sites;
  },
};

export default {
  state,
  mutations,
  actions,
  getters,
};
