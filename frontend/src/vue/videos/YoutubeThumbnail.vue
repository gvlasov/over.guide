<template>
    <img class="youtube-thumbnail" :src="src"/>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";

@Component({
    components: {}
})
export default class YoutubeThumbnail extends Vue {
    @Prop({required: true})
    videoId: string

    get src(): string {
        return `https://i3.ytimg.com/vi/${this.videoId}/mqdefault.jpg`
    }
};

</script>

<style scoped>
</style>
