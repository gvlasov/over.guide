<template>
    <div class="guide-content">
        <div v-for="(widget, index) in entry.parts" :key="index" class="guide-part">
            <div class="text-guide-part" v-if="widget.isText">
                <GuidePartText :part="widget.part"/>
            </div>
            <GuideVideo
                    v-if="widget.part.kind === 'video'"
                    entry="entry"
                    :part="widget.part"
                    :index="index"
                    :initial-show-preload="true"
                    @comesIntoVision="(e) => $emit('comesIntoVision', e)"
                    @comesOutOfVision="(e) => $emit('comesOutOfVision', e)"
                    @play="(player) => $emit('play', player)"
                    @playerReady="(player) => $emit('playerReady', player)"
            />
        </div>
    </div>
</template>

<script lang="ts">
import GuidePartText from "@/vue/guides/GuidePartText";
import GuideVideo from "@/vue/guides/GuideVideo";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'
import GuideHistoryEntryVso from "../../ts/vso/GuideHistoryEntryVso";

@Component({
    components: {
        GuideVideo,
        GuidePartText,
    },
})
export default class Guide extends Vue {
    @Prop({required: true})
    entry: GuideHistoryEntryVso
};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

.guide-content {
    .guide-part {
        box-sizing: border-box;
        /*background-color: rgba(43, 55, 83, 0.8);*/
        color: white;
        position: relative;


        .text-guide-part {
            max-width: 100%;
            font-family: $body-font;
        }

        .text-guide-part-content {
            text-align: left;
            font-size: 1.5em;
            word-break: break-word;
        }
    }
}

</style>
