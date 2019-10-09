<template>
  <div>
    <header class="header">
      <div class="inner container">
        <div class="logo">
          <router-link to="/" class="logo-link">
            <h1>SCM - Location Tracker</h1>
          </router-link>
        </div>

        <nav class="menu">
          <ul>
            <li class="link-box">
              <router-link to="/">
                <!-- <span class="menu-icon icon-quill"></span> -->
                <span class="menu-text">Add Shipping detail</span>
              </router-link>
            </li>
            <li class="link-box">
              <router-link to="/search">
                <!-- <span class="menu-icon icon-home"></span> -->
                <span class="menu-text">Search</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {}
};
</script>