import AddDetail from "../vue/components/main-content/AddDetail.vue";
import Search from "../vue/components/main-content/Search.vue";
export const routes = [{
    path: "/",
    component: AddDetail
},
// Search Page
{
    path: "/search",
    component: Search
}, {
    path: "/search/:timestamp/:boxNumber",
    component: Search
}];