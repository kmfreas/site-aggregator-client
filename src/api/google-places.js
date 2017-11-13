/* eslint-disable no-new */
export default {
  getPlaces(params) {
    return new Promise((resolve) => {
      const results = [];
      const formattedParams = {
        location: new google.maps.LatLng(params.location.latitude, params.location.longitude),
        keyword: [params.keyword],
        radius: params.radius * 1000,
      };
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      this.getPlaceList(formattedParams, service).then((response) => {
        resolve(response);
      }, (reason) => {
        console.log(reason);
        resolve(results);
      });
    });
  },
  getPlaceList(params, service) {
    return new Promise((resolve, reject) => {
      service.nearbySearch(params, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          resolve(results);
        } else {
          reject(status);
        }
      });
    });
  },
  getPlaceDetails(item) {
    return new Promise((resolve, reject) => {
      const service = new google.maps.places.PlacesService(document.createElement('div'));
      service.getDetails({
        placeId: item.place_id,
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
    });
  },
};
