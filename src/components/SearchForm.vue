<template>
  <div class="search-form">
    <div class="field">
      <label for="keyword" class="label has-text-white">Search For</label>
      <div class="control has-icons-left has-icons-right">
        <input type="text" name="keyword" class="input" v-model="keyword" placeholder="Search">
        <span class="icon is-small is-left">
          <i class="fa fa-search"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fa fa-check" :class="{'has-text-info': keyword}"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <label for="location" class="label has-text-white">City</label>
      <div class="control has-icons-left has-icons-right">
        <vue-google-autocomplete id="location" class="input" types="(cities)" @placechanged="getLocation" placeholder="City"></vue-google-autocomplete>
        <span class="icon is-small is-left">
          <i class="fa fa-map-marker"></i>
        </span>
        <span class="icon is-small is-right">
          <i class="fa fa-check" :class="{'has-text-info': location}"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <label for="radius" class="label has-text-white">Radius</label>
      <div class="control has-icons-left has-icons-right">
        <div class="select">
          <select name="radius" id="radius" v-model="radius">
            <option disabled value="">Please select one</option>
            <option value="10">10km</option>
            <option value="25">25km</option>
            <option value="100">100km</option>
          </select>
        </div>
        <span class="icon is-small is-left">
          <i class="fa fa-map-marker"></i>
        </span>
      </div>
    </div>
    <div class="field">
      <div class="control">
        <button class="button is-info" :disabled="!submittable" @click="search">
          Search
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { mapActions, mapMutations } from 'vuex';

export default {
  components: {
    VueGoogleAutocomplete,
  },
  mounted() {},
  data() {
    return {
      location: null,
      keyword: null,
      radius: 10,
    };
  },
  computed: {
    submittable() {
      return (this.location !== null) && (this.keyword !== null);
    },
  },
  methods: {
    getLocation(addressData, placeResultData) {
      console.log(addressData, placeResultData);
      this.location = addressData;
    },
    search() {
      this.clearSites();
      this.getSites({
        location: this.location,
        keyword: this.keyword,
        radius: this.radius,
      }).then(() => {
        this.getSiteDetails();
      });
    },
    ...mapActions({
      getSites: 'getSites',
      getSiteDetails: 'getSiteDetails',
    }),
    ...mapMutations({
      clearSites: 'clearSites',
    }),
  },
};
</script>
