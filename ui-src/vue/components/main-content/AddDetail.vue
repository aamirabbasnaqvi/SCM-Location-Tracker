<template>
  <div class="container page-container add-detail-page">
    <form action="/dictionary/" method="get" v-on:submit="submitSaveForm">
      <div class="flex-row add-detail-inputs">
        <div class="col-desktop-4 col-desktop-offset-2">
          <select v-model="fromBox">
            <option value selected>From</option>
            <option
              v-for="(fromBoxItem) of shippingControls.boxes"
              v-bind:value="fromBoxItem.id"
              v-text="`Box ${fromBoxItem.id}`"
            ></option>
          </select>
        </div>
        <div class="col-desktop-4">
          <select v-model="toBox">
            <option value selected>To</option>
            <option
              v-for="(toBoxItem) of shippingControls.boxes"
              v-bind:value="toBoxItem.id"
              v-text="`Box ${toBoxItem.id}`"
            ></option>
          </select>
        </div>
      </div>
      <div class="flex-row add-detail-inputs">
        <div class="col-desktop-4 col-desktop-offset-2">
          <select v-model="boxLocation">
            <option value selected>Select Location</option>
            <option
              v-for="(locationItem) of shippingControls.location"
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
            :disabled="!fromBox || (toBox && !packType) || !boxLocation || (fromBox === toBox)"
          >Save</button>
        </div>
      </div>
    </form>

    <p
      class="ajax-status"
      role="alert"
      v-bind:class="{'success': statusBar.status === 'success' , 'error': statusBar.status === 'error'}"
      v-text="statusBar.status === 'success' ? statusBar.successMessage : statusBar.errorMessage"
    ></p>
  </div>
</template>

<script>
import axios from "axios";
import { hostIP } from "../../../js/config";

export default {
  data() {
    return {
      toBox: "",
      fromBox: "",
      boxLocation: "",
      packType: "",
      shippingControls: {
        boxes: [],
        location: []
      },
      statusBar: {
        status: "",
        errorMessage: "Hey, some problem has occured",
        successMessage: "Hey, the value has been updated"
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

      if (
        !fromBox ||
        (toBox && !packType) ||
        !boxLocation ||
        fromBox === toBox
      ) {
        return;
      }

      const self = this;

      const data = {
        location: self.boxLocation,
        fromBox: self.fromBox,
        toBox: self.toBox,
        packageType: self.packType,
        state: "inprogress"
      };

      axios
        .post(`${hostIP}/updateBoxes`, data)
        .then(({ data }) => {
          if (data.status === "fail") {
            this.showStatusBar("error", data.errorMessage);
          } else {
            this.resetControlsSelection();
            this.showStatusBar("success");
          }
        })
        .catch(function(exception) {
          console.warn(`exception caught in ajax call: ${exception}`);
        })
        .finally(function(response) {
          // app.globalFlags.pageIsLoading = false;
        });
    },
    showStatusBar: function(status = "error", message) {
      this.statusBar.status = status;

      if (status === "error" && message) {
        this.statusBar.errorMessage = message;
      }

      setTimeout(() => {
        this.statusBar.status = "";
      }, 5000);
    },
    resetControlsSelection() {
      this.boxLocation = "";
      this.fromBox = "";
      this.toBox = "";
      this.packType = "";
    },
    hideStatusBar() {},
    getShippingControls() {
      axios
        .get(`${hostIP}/initialData`)
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