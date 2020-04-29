var Vue = require('vue');
var HeroPortrait = require('../vue/HeroPortrait.vue');

var app = new Vue({
    el: '#app',
    render: function (h) {
        return h(require('../vue/App.vue'));
    },
});
