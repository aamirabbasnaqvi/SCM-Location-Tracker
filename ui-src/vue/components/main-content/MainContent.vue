<template>
  <div class="app-wrap">
    <MainHeader />
    <router-view :key="$route.path"></router-view>
    <MainFooter />
  </div>
</template>

<script>
import MainHeader from "../main-header/MainHeader.vue";
import MainFooter from "../main-footer/MainFooter.vue";

export default {
  props: {},
  data() {
    return {};
  },
  methods: {
    check() {}
  },
  beforeUpdate: function() {},
  updated: function() {},
  created: function() {
    window.scrollTo(0, 0);
  },
  mounted: function() {},
  components: {
    MainHeader,
    MainFooter
  }
};
</script>