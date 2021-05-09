<template>
    <video
            :controls="controls"
            preload="auto"
    >
        <source
                v-if="$asyncComputed.mp4Url.success"
                :src="mp4Url"
        />
        Could not load video
    </video>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import Backend from "@/ts/Backend";
import AsyncComputedProp from "vue-async-computed-decorator";
const ytdl = require('ytdl-core-browser')

@Component({
    components: {
    }
})
export default class VideoFrameViewer extends Vue {

    @Prop({required: true})
    videoId: string

    @Prop({default: true})
    controls: boolean

    @AsyncComputedProp()
    async mp4Url(): Promise<string> {
        return Backend.instance.getYoutubeStreamUrl(this.videoId)
    }

};

</script>

<style scoped>
</style>
