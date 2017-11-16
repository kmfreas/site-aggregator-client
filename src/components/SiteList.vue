<template>
  <section class="site-list">
    <div class="loading" v-if="!sites.length" style="margin-top: 3em"></div>
    <div class="level" v-if="sites.length">
      <div class="level-left">
        <div class="level-item">
          <!-- <button class="button is-primary" @click="openAll" title="Allow popups if asked">
            Open All in {{sites.length}} Tabs
          </button> -->
        </div>
      </div>
    </div>
    <div class="columns is-multiline" v-if="sites.length">
      <div class="column is-4" v-for="(site, index) in sites" :key="site.id" v-if="site.website">
        <div class="card">
          <div class="card-image">
            <figure class="image is-square" :class="{'loading': !site.img}">
              <a :href="site.website" target="_blank" v-if="site.img">
                <img :src="site.img" alt="" width="1000" height="1000">
              </a>
            </figure>
          </div>
          <div class="card-content">
            <h2 class="title is-5">
              <a :href="site.website" target="_blank">{{site.name}}</a>
            </h2>
            <h3 class="subtitle is-6">
              {{site.vicinity}}
            </h3>
            <div class="field is-grouped is-grouped-multiline" v-if="site.rating">
              <div class="control">
                <div class="tags has-addons">
                  <span class="tag is-light">Rating</span>
                  <span class="tag is-primary">
                    {{site.rating}}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  mounted() {
  },
  computed: {
    ...mapGetters({
      sites: 'getSites',
    }),
  },
  methods: {
    openAll() {
      this.sites.forEach((site) => {
        window.open(site.website);
      });
    },
  },
};
</script>

<style>
.site-list {
  padding: 2em 0;
}
</style>
