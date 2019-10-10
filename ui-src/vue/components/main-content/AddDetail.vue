<template>
  <div class="container page-container add-detail-page">
    <fieldset>
      <legend>Generate a new Box</legend>

      <form v-on:submit="generateNewBox">
        <div class="flex-row add-detail-inputs">
          <div class="col-desktop-4 col-desktop-offset-2">
            <select v-model="locationForNewBox">
              <option value selected>Select Location</option>
              <option
                v-for="(locationItem) of shippingControls.location"
                v-bind:value="locationItem"
                v-text="locationItem"
              ></option>
            </select>
          </div>
          <div class="col-desktop-4">
            <button class="button" :disabled="!locationForNewBox">Generate new Box</button>
          </div>
        </div>
      </form>
    </fieldset>

    <fieldset>
      <legend>Change an existing Box</legend>
      <form method="get" v-on:submit="submitSaveForm">
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
    </fieldset>

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
      locationForNewBox: "",
      shippingControls: {
        boxes: [],
        location: []
      },
      statusBar: {
        status: "",
        errorMessage: "Hey, some problem has occured",
        successMessage: "Hey, the value has been updated",
        defaultErrorMessage: "Hey, some problem has occured",
        defaultSuccessMessage: "Success"
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
            this.showStatusBar({ status: "error", message: data.errorMessage });
          } else {
            this.resetControlsSelection();
            this.showStatusBar({
              status: "success",
              message: "The box has been updated successfully"
            });
          }
        })
        .catch(function(exception) {
          console.warn(`exception caught in ajax call: ${exception}`);
        })
        .finally(function(response) {
          // app.globalFlags.pageIsLoading = false;
        });
    },
    generateNewBox: function(event) {
      event.preventDefault();

      const locationForNewBox = this.locationForNewBox;

      if (!locationForNewBox) {
        return;
      }

      const data = {
        location: locationForNewBox
      };

      axios
        .post(`${hostIP}/box`, data)
        .then(({ data }) => {
          this.getShippingControls();
          this.showStatusBar({
            status: "success",
            message: "The box has been generated successfully"
          });
        })
        .catch(function(exception) {
          console.warn(`exception caught in ajax call: ${exception}`);
        })
        .finally(function(response) {
          // app.globalFlags.pageIsLoading = false;
        });
    },
    showStatusBar: function(params) {
      this.statusBar.status = params.status;

      if (params.status === "error") {
        this.statusBar.errorMessage =
          params.message || this.statusBar.defaultErrorMessage;
      } else {
        this.statusBar.successMessage =
          params.message || this.statusBar.defaultSuccessMessage;
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