import Vue from "vue";
import VueRouter from "vue-router";
import { routes } from "./router-config";
import MainContent from "../vue/components/main-content/MainContent.vue";

Vue.config.devtools = true;

let router = new VueRouter({
    routes,
    mode: "history"
});

router.beforeEach((to, from, next) => {
    next();
});

Vue.use(VueRouter);

var app = new Vue({
    el: "#app",
    router,
    components: {
        MainContent
    },
    data() {
        return {
            siteData: {
                response: {
                }
            },
            globalFlags: {
                pageIsLoading: false,
            }
        };
    },
    beforeMount: function () {
    }
});