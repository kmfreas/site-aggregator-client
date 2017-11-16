/* eslint-disable no-new */
import bus from '../bus';
import Id from '../id';

export default {
  service: new google.maps.places.PlacesService(document.createElement('div')),
  getPlaces(id, params) {
    return new Promise((resolve, reject) => {
      const formattedParams = {
        location: new google.maps.LatLng(params.location.latitude, params.location.longitude),
        keyword: [params.keyword],
        radius: params.radius * 1000,
      };
      this.getPlaceList(id, formattedParams, this.service).then((response) => {
        resolve(response);
      }, (reason) => {
        reject(reason);
      });
    });
  },
  getPlaceList(id, params) {
    return new Promise((resolve, reject) => {
      this.service.nearbySearch(params, (results, status, pagination) => {
        if (id === Id.get()) {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            bus.$emit('sitesLoaded', results);
            if (pagination.hasNextPage) {
              pagination.nextPage();
            } else {
              resolve();
            }
          } else {
            reject(status);
          }
        }
      });
    });
  },
  getPlaceDetails(id) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        this.service.getDetails({
          placeId: id,
        }, (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            resolve({
              website: place.website,
              place_id: place.place_id,
            });
          } else {
            reject(status);
          }
        });
      }, 1000);
    });
  },
};
