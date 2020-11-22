<template>
    <v-sprite
            :id="'sprite'"
            :spritesheet="'/icons/spinner-sprite-modified.png'"
            :json="json"
            :yoyo="false"
            :fps="fps"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({})
export default class Spinner extends Vue {
    @Prop({default: 24})
    fps: number

    json = require('@/assets/icons/spinner-spritesheet.json')
};

</script>

<style scoped>
</style>
