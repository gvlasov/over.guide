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
import UserPage from "@/vue/UserPage.vue";
import GuidePage from "@/vue/guides/GuidePage.vue";
import ModerationPage from "@/vue/moderation/ModerationPage.vue";
import SiteResetPage from "@/vue/SiteResetPage.vue";
import VueScrollTo from 'vue-scrollto';
import VueObserveVisibility from 'vue-observe-visibility'
import '@/ts/utils/vue-array-replace'
import {FontAwesomeIcon} from '@fortawesome/vue-fontawesome'
import {library} from '@fortawesome/fontawesome-svg-core'
import SupportWebsitePage from "@/vue/SupportWebsitePage.vue"
import {
    faBan,
    faBell,
    faBrain,
    faExternalLinkAlt,
    faHome,
    faMedal,
    faPlus,
    faPlusSquare,
    faUser,
} from '@fortawesome/free-solid-svg-icons'
import {
    faBitcoin,
    faPatreon,
    faPaypal,
    faTwitch,
} from '@fortawesome/free-brands-svg-icons'
import PortalVue from 'portal-vue'

library.add(faBrain);
library.add(faHome);
library.add(faPlusSquare);
library.add(faMedal);
library.add(faUser);
library.add(faBell);
library.add(faExternalLinkAlt);
library.add(faBan);
library.add(faPatreon);
library.add(faTwitch);
library.add(faBitcoin);
library.add(faPaypal);
library.add(faPlus);

const VueResizeObserver = require('vue-resize-observer')

const router = new VueRouter({
    routes: [
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
