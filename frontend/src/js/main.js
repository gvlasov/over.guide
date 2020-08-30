import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './utils/vue-array-replace'
import VueRouter from 'vue-router';
import CountersPractice from '@/vue/training/CountersPractice.vue';
import PickSuggestion from "@/vue/training/PickSuggestion.vue";
import GuideEditor from "@/vue/guides/GuideEditor.vue";
import TestingGround from "@/vue/TestingGround";
import GuideSearch from "@/vue/guides/GuideSearch";
import AsyncComputed from 'vue-async-computed'
import {VueHammer} from 'vue2-hammer'
import TrainingGoals from "@/vue/guides/TrainingGoals";
import UserInfo from "@/vue/UserInfo";


const router = new VueRouter({
    routes: [
        {path: '/counters-practice', component: CountersPractice},
        {path: '/suggest-pick', component: PickSuggestion},
        {path: '/guide-editor/:descriptor?', component: GuideEditor},
        {path: '/testing-ground', component: TestingGround},
        {path: '/search/:descriptor?', component: GuideSearch},
        {path: '/training-goals', component: TrainingGoals},
        {path: '/user/:id', component: UserInfo},
    ],
    scrollBehavior(){
        return {x: 0, y: 0}
    }
});
Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(AsyncComputed)
Vue.use(VueHammer);
VueHammer.config.pan = {
    threshold: 5
};
const app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue').default);
    },
    router
});
