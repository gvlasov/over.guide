import '@/assets/css/global.scss'
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
import UserPage from "@/vue/profile/UserPage.vue";
import GuidePage from "@/vue/guides/GuidePage.vue";
import ModerationPage from "@/vue/moderation/ModerationPage.vue";
import SiteResetPage from "@/vue/SiteResetPage.vue";
import VueScrollTo from 'vue-scrollto';
import VueObserveVisibility from 'vue-observe-visibility'
import '@/ts/utils/vue-array-replace'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import SupportWebsitePage from "@/vue/SupportWebsitePage.vue"
import PortalVue from 'portal-vue'
import MatchupEvaluationsPage
    from '@/vue/evaluations/MatchupEvaluationsPage.vue'

const VueSpriteAnimator = require('vue-sprite-animator').default

require('./fontawesome')

const VueResizeObserver = require('vue-resize-observer')

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: '/search/'
        },
        {
            path: '/counters-practice',
            component: CountersPractice,
            name: 'Counters practice'
        },
        {path: '/suggest-pick', component: PickSuggestion},
        {
            path: '/guide-editor/:id?/:descriptor?',
            component: GuideEditor,
            name: 'Create guide'
        },
        {path: '/testing-ground', component: TestingGround},
        {
            path: '/search/:descriptor?',
            component: GuideSearch,
            name: 'Browse guides'
        },
        {
            path: '/training-goals',
            component: TrainingGoals,
            name: 'My training goals'
        },
        {path: '/user/:id', component: UserPage, name: 'Profile'},
        {path: '/guide/:id', component: GuidePage},
        {path: '/moderation', component: ModerationPage, name: 'Moderation'},
        {path: '/site-reset', component: SiteResetPage, name: 'Reset storage'},
        {path: '/matchup-evaluations', component: MatchupEvaluationsPage, name: 'My matchups'},
        {
            path: '/support',
            component: SupportWebsitePage,
            name: 'Support this website'
        },
    ],
    scrollBehavior(to) {
        if (to.hash) {
            return {
                selector: to.hash,
                offset: {x: 0, y: 50},
            };
        }
        return {x: 0, y: 0};
    }
});

Vue.component('font-awesome-icon', FontAwesomeIcon);
Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(VueAxios, axios);
Vue.use(AsyncComputed)
Vue.use(VueHammer);
Vue.use(VueObserveVisibility)
Vue.use(VueResizeObserver);
Vue.use(PortalVue)
Vue.use(VueSpriteAnimator)
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
if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js')
        .then(function () {
        });
}
(window as any).deferredPrompt = null;
window.addEventListener('beforeinstallprompt', (e: any) => {
    (window as any).deferredPrompt = e;
    e.preventDefault();
})
