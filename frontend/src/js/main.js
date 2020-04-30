import Vue from "vue";

var app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue'));
    },
});
