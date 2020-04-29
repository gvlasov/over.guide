var Vue = require('vue');
var Picks = require('../vue/Picks.vue');

var app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue'));
    }
});
