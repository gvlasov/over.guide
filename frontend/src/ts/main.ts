import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './utils/vue-array-replace'
import VueRouter from 'vue-router';
import CountersPractice from '@/vue/training/CountersPractice.vue';
import PickSuggestion from "@/vue/training/PickSuggestion.vue";
import GuideEditor from "@/vue/guides/editor/GuideEditor.vue";
import TestingGround from "@/vue/TestingGround.vue";
import GuideSearch from "@/vue/guides/GuideSearch.vue";
import AsyncComputed from 'vue-async-computed'
import {VueHammer} from 'vue2-hammer'
import TrainingGoals from "@/vue/guides/TrainingGoals.vue";
import UserInfo from "@/vue/UserInfo.vue";
import VueScrollTo from 'vue-scrollto';
import VueObserveVisibility from 'vue-observe-visibility'
import '@/ts/utils/vue-array-replace'

const VueResizeObserver = require('vue-resize-observer')

const router = new VueRouter({
    routes: [
        {path: '/counters-practice', component: CountersPractice},
        {path: '/suggest-pick', component: PickSuggestion},
        {path: '/guide-editor/:id?/:descriptor?', component: GuideEditor},
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
Vue.use(VueObserveVisibility)
Vue.use(VueResizeObserver);
VueHammer.config.pan = {
    threshold: 5
};
Vue.use(VueScrollTo)
const app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue').default);
    },
    router
});
