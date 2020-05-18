import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import './utils/vue-array-replace'

Vue.use(VueAxios, axios);
const app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue'));
    },
});
