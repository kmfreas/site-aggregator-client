<template>
  <form class="search-form" @submit.prevent>
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
        <button class="button is-info" :disabled="!submittable" @click="search" v-if="displayButton === 'search'">
          Search
        </button>
        <button class="button is-warning" @click="cancel" v-if="displayButton === 'cancel'">
          Cancel
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import VueGoogleAutocomplete from 'vue-google-autocomplete';
import { mapActions, mapGetters } from 'vuex';

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
      searchStarted: false,
    };
  },
  computed: {
    submittable() {
      return (this.location !== null) && (this.keyword !== null);
    },
    displayButton() {
      return !this.searchComplete && this.searchStarted ? 'cancel' : 'search';
    },
    ...mapGetters({
      searchComplete: 'searchComplete',
    }),
  },
  methods: {
    getLocation(addressData) {
      this.location = addressData;
    },
    search() {
      this.cancel();
      this.searchStarted = true;
      this.getSites({
        location: this.location,
        keyword: this.keyword,
        radius: this.radius,
      });
    },
    cancel() {
      this.searchStarted = false;
      this.clear();
    },
    ...mapActions({
      getSites: 'getSites',
      clear: 'clear',
    }),
  },
};
</script>
