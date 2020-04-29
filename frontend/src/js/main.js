var Vue = require('vue');
var Picks = require('../vue/Picks.vue');
var Hero = require('./Hero');

var app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue'));
    },
});
