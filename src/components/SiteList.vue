<template>
  <section class="site-list">
    <div class="level">
      <div class="level-left">
        <div class="level-item">
          <button class="button is-primary" @click="openAll" title="Allow popups if asked">
            Open All in {{sites.length}} Tabs
          </button>
        </div>
      </div>
    </div>
    <div class="columns is-multiline">
      <div class="column is-4" v-for="(site, index) in sites" :key="site.id">
        <div class="card">
          <div class="card-image">
            <div class="img-placeholder notification is-dark loading" v-if="!site.img"></div>
            <figure class="image" v-if="site.img">
              <img :src="site.img" alt="">
            </figure>
          </div>
          <div class="card-content">
            <h2 class="title is-5">
              <a :href="site.website" target="_blank">{{site.name}}</a>
            </h2>
            <h3 class="subtitle is-6">
              {{site.vicinity}}
            </h3>
            <div class="field is-grouped is-grouped-multiline">
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

.img-placeholder.notification {
  padding: 0;
  padding-bottom: 100%;
  border-radius: 0;
  display: block;
  margin-bottom: 0;
}
</style>
