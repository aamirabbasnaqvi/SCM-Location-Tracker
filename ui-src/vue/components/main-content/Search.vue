<template>
  <div class="container page-container search-page">
    <form
      class="search-bar flex-row"
      action="/dictionary/"
      method="get"
      v-on:submit="submitSearchForm"
    >
      <div class="col-desktop-4">
        <input v-model="timestamp" type="datetime-local" placeholder="Timestamp" step="1" />
      </div>
      <div class="col-desktop-4">
        <input v-model="boxNumber" type="number" placeholder="Box number" />
      </div>
      <div class="col-desktop-4">
        <button class="search-button button">Search</button>
      </div>
    </form>

    <h2
      v-if="!searchedResults.actions[0] && !searchedResults.boxState[0] && !Object.keys($route.params).length"
      class="search-heading"
    >Please search for an item</h2>
    <h2
      v-else-if="(timestamp || boxNumber) &&  !searchedResults.actions[0] && !searchedResults.boxState[0] && Object.keys($route.params).length"
      class="no-results"
    >There are no results for this search</h2>

    <h2
      v-else-if="searchedResults.currentLocation"
      class="search-heading"
    >The searched box is at {{searchedResults.currentLocation}}</h2>

    <!--  -->
    <div class="results-table" v-if="searchedResults.actions[0]">
      <h2 class="results-table-head">Actions</h2>
      <p class="result-row" v-for="searchedIem in searchedResults.actions" v-text="searchedIem"></p>
    </div>
    <!--  -->

    <div class="results-table" v-if="searchedResults.boxState[0]">
      <h2 class="results-table-head">Box states</h2>
      <p class="result-row" v-for="searchedIem in searchedResults.boxState" v-text="searchedIem"></p>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { hostIP } from "../../../js/config";

export default {
  data() {
    return {
      timestamp: null,
      boxNumber: null,
      searchedResults: {
        actions: [],
        boxState: [],
        currentLocation: ""
      }
    };
  },
  methods: {
    getSearchedData() {
      if (!Object.keys(this.$route.params).length) {
        return;
      }

      const timeStamp = this.timestamp ? `timestamp=${this.timestamp}` : "";
      const boxNumber = this.boxNumber ? `boxId=${this.boxNumber}` : "";

      axios
        .get(
          `${hostIP}/search?${timeStamp}${
            timeStamp && boxNumber ? `&` : ``
          }${boxNumber}`
        )
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

      this.$router.push(`/search/${timestamp}/${boxNumber}`);
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