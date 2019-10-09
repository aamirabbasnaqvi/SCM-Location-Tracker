<template>
  <div class="container page-container add-detail-page">
    <form action="/dictionary/" method="get" v-on:submit="submitSaveForm">
      <div class="flex-row add-detail-inputs">
        <div class="col-desktop-4 col-desktop-offset-2">
          <select v-model="fromBox">
            <option value selected>From</option>
            <option
              v-for="(fromBoxItem) of shippingControls.boxes"
              v-bind:value="fromBoxItem"
              v-text="fromBoxItem"
            ></option>
          </select>
        </div>
        <div class="col-desktop-4">
          <select v-model="toBox">
            <option value selected>To</option>
            <option
              v-for="(toBoxItem) of shippingControls.boxes"
              v-bind:value="toBoxItem"
              v-text="toBoxItem"
            ></option>
          </select>
        </div>
      </div>
      <div class="flex-row add-detail-inputs">
        <div class="col-desktop-4 col-desktop-offset-2">
          <select v-model="boxLocation">
            <option value selected>Location</option>
            <option
              v-for="(locationItem) of shippingControls.boxLocation"
              v-bind:value="locationItem"
              v-text="locationItem"
            ></option>
          </select>
        </div>
        <div class="col-desktop-4">
          <select v-model="packType">
            <option value selected>Type</option>
            <option value="p">Pack</option>
            <option value="u">Unpack</option>
          </select>
        </div>
        <div class="col-desktop-4 col-desktop-offset-2">
          <button
            class="button"
            :disabled="!fromBox || (toBox && !packType) || !(toBox || boxLocation)"
          >Save</button>
        </div>
      </div>
    </form>

    <p class="ajax-status" role="alert" v-bind:class="{'success': statusBar.status === 'success' , 'error': statusBar.status === 'error'}" v-text="statusBar.message" ></p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      toBox: "",
      fromBox: "",
      boxLocation: "",
      packType: "",
      shippingControls: {
        boxes: [],
        boxLocation: []
      },
      statusBar: {
        message: "",
        status: ""
      }
    };
  },
  methods: {
    submitSaveForm(event) {
      event.preventDefault();

      const fromBox = this.fromBox;
      const toBox = this.toBox;
      const boxLocation = this.boxLocation;
      const packType = this.packType;

      if (!fromBox || (toBox && !packType) || !(toBox || boxLocation)) {
        return;
      }

      const self = this;

      const data = {
        boxLocation: self.boxLocation,
        fromBox: self.fromBox,
        toBox: self.toBox,
        packType: self.packType
      };

      axios
        .post(`/json/save-details.json`, data)
        .then(({ data }) => {
          this.statusBar = data;

          if (data.status === "success") {
            this.resetControlsSelection();
            setTimeout(this.resetStatusBarData, 5000);
          }
        })
        .catch(function(exception) {
          console.warn(`exception caught in ajax call: ${exception}`);
        })
        .finally(function(response) {
          // app.globalFlags.pageIsLoading = false;
        });
    },
    resetControlsSelection() {
      this.boxLocation = "";
      this.fromBox = "";
      this.toBox = "";
      this.packType = "";
    },
    resetStatusBarData() {
      this.statusBar = {
        message: "",
        status: ""
      };
    },
    getShippingControls() {
      axios
        .post(`/json/get-controls.json`)
        .then(({ data }) => {
          this.shippingControls = data;
        })
        .catch(function(exception) {
          console.warn(`exception caught in ajax call: ${exception}`);
        })
        .finally(function(response) {
          // app.globalFlags.pageIsLoading = false;
        });
    }
  },
  props: {},
  created: function() {},
  mounted: function() {
    this.getShippingControls();
  },
  components: {}
};
</script>