<template>
    <YoutubeVideoStreamViewer
            :video-id="youtubeVideoId"
            :playing="false"
            :controls="false"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop, Watch} from "vue-property-decorator";
import Component from "vue-class-component";
import YoutubeVideoStreamViewer
    from "@/vue/videos/YoutubeVideoStreamViewer.vue";

@Component({
    components: {
        YoutubeVideoStreamViewer,
    }
})
export default class VideoFrameViewer extends Vue {

    declare $el: HTMLVideoElement

    @Prop({required: true})
    youtubeVideoId: string

    @Prop({required: true})
    timeSeconds: number

    @Watch('timeSeconds')
    onTimeSecondsChange(newValue: number) {
        this.$el.currentTime = newValue
    }


    mounted() {
        const self = this
        this.$el.addEventListener('loadedmetadata', function() {
            this.currentTime = self.timeSeconds
        }, false)
    }

};

</script>

<style scoped>
</style>
