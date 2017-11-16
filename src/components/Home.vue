<template>
  <div class="page">
    <section class="hero is-primary">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Site Aggregator!
          </h1>
          <search-form></search-form>
        </div>
      </div>
    </section>
    <div class="container page-content">
      <site-list></site-list>
    </div>
    <footer class="footer">
      <div class="container">
        <img style="max-width: 200px;" src="static/google.png" alt="">
        <br>
        Written in Vue JS
        <br>
        <a target="_blank" href="http://krez.me">krez.me</a>
      </div>
    </footer>
  </div>
</template>

<script>
import SearchForm from './SearchForm';
import SiteList from './SiteList';

export default {
  components: {
    SearchForm,
    SiteList,
  },
};
</script>
