<template>
  <div class="container page-container search-page">
    <form
      class="search-bar flex-row"
      action="/dictionary/"
      method="get"
      v-on:submit="submitSearchForm"
    >
      <div class="col-desktop-4">
        <input v-model="timestamp" type="datetime-local" placeholder="Timestamp" />
      </div>
      <div class="col-desktop-4">
        <input v-model="boxNumber" type="number" placeholder="Box number" />
      </div>
      <div class="col-desktop-4">
        <button
          class="search-button button"
          :disabled="(!timestamp || !timestamp.trim()) && (!boxNumber || !boxNumber.trim())"
        >Search</button>
      </div>
    </form>

    <h2
      v-if="!searchedResults[0] && !Object.keys($route.params).length"
      class="search-heading"
    >Please search for an item</h2>
    <h2
      v-else-if="(timestamp || boxNumber) &&  !searchedResults[0] && Object.keys($route.params).length"
      class="no-results"
    >There are no results for this search</h2>

    <!--  -->
    <div class="results-table" v-for="resultItem in searchedResults">
      <div class="flex-row title-row">
        <div class="col-desktop-4">
          <h3 class="column-title">Box ID</h3>
        </div>
        <div class="col-desktop-4">
          <h3 class="column-title">Location</h3>
        </div>
        <div class="col-desktop-4">
          <h3 class="column-title">Timestamp</h3>
        </div>
      </div>
      <!--  -->
      <div class="flex-row" v-for="boxItem in resultItem">
        <div class="col-desktop-4">
          <p class="column-data" v-text="boxItem.boxID"></p>
        </div>
        <div class="col-desktop-4">
          <p class="column-data" v-text="boxItem.location"></p>
        </div>
        <div class="col-desktop-4">
          <p class="column-data" v-text="boxItem.timestamp"></p>
        </div>
      </div>

      <!--  -->
    </div>
    <!--  -->
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      timestamp: null,
      boxNumber: null,
      searchedResults: []
    };
  },
  methods: {
    getSearchedData() {
      const timestamp = this.timestamp;
      const boxNumber = this.boxNumber;

      if (!timestamp && !boxNumber) {
        return;
      }

      axios
        .get(`/json/search-results.json?${timestamp}/${boxNumber}`)
        .then(({ data }) => {
          this.searchedResults = data;
        })
        .catch(function(exception) {
          console.warn(`exception caught in ajax call: ${exception}`);
        })
        .finally(function(response) {
          // app.globalFlags.pageIsLoading = false;
        });
    },
    submitSearchForm(event) {
      event.preventDefault();
      const timestamp = this.timestamp ? this.timestamp.trim() : null;
      const boxNumber = this.boxNumber ? this.boxNumber.trim() : null;

      if (timestamp || boxNumber) {
        this.$router.push(`/search/${timestamp}/${boxNumber}`);
      }
      return false;
    }
  },
  props: {},
  created: function() {},
  mounted: function() {
    const params = this.$route.params;

    params.timestamp && params.timestamp !== "null"
      ? (this.timestamp = params.timestamp)
      : null;
    params.boxNumber && params.boxNumber !== "null"
      ? (this.boxNumber = params.boxNumber)
      : null;

    this.getSearchedData();
  },
  components: {},
  beforeUpdate: function() {}
};
</script>