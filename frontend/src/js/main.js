import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './utils/vue-array-replace'
import VueRouter from 'vue-router';
import CountersPractice from '@/vue/training/CountersPractice.vue';
import PickSuggestion from "@/vue/training/PickSuggestion.vue";
import GuideEditor from "@/vue/guides/GuideEditor.vue";
import TestingGround from "@/vue/TestingGround";

const router = new VueRouter({
    routes: [
        {path: '/counters-practice', component: CountersPractice},
        {path: '/suggest-pick', component: PickSuggestion},
        {path: '/guide-editor', component: GuideEditor},
        {path: '/testing-ground', component: TestingGround},
    ]
});
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
const app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue').default);
    },
    router
});
