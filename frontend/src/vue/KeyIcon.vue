<template>
    <div class="keycap">{{keyVso.name}}</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";

@Component({
    props: {
        'keyVso': {
            type: Object,
            required: true,
        },
    }
})
export default class KeyIcon extends Vue {
};

</script>

<style scoped>
    @import "~@/assets/css/fonts.scss";

    img {
        width: 100%;
    }

    .keycap {
        display: inline-block;
        border-radius: .6em;

        border: .1em solid white;
        width: 2.9rem;
        min-width: 2.9rem;
        height: 2.9rem;
        line-height: 2.9rem;

        font-size: 1.2em;
        color: white;
        vertical-align: middle;
        background-color: transparent;
        font-family: 'Futura Demi Bold', 'sans-serif';
        font-variant: all-small-caps;
    }
</style>
