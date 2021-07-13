<template>
    <div class="youtube-video-link-form">
        <input
                type="text"
                class="youtube-video-link-input"
                v-model="youtubeVideoUrl"
                placeholder="Put here a link to a Youtube video"
        />
        <div class="youtube-video-link-errors">
            <template v-if="$asyncComputed.validations.success">
                <template v-if="youtubeVideoUrl === ''"></template>
                <div v-else-if="!validations.isUrl">This is not a valid URL</div>
                <div v-else-if="!validations.isValidYoutubeVideoUrl">This is not a valid Youtube video URL</div>
                <div v-else-if="!validations.isEmbeddingAllowed">Video owner prohibited embedding of this video</div>
                <div v-else-if="!validations.videoExists">This video doesn't exist</div>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import YoutubeUrlVso from "@/ts/vso/YoutubeUrlVso";
import EmbeddableCache from "@/ts/EmbeddableCache";
import Vue from 'vue'
import Component from 'vue-class-component'
import {Watch} from "vue-property-decorator";
import AsyncComputedProp from 'vue-async-computed-decorator'

@Component({
    components: {},
})
export default class YoutubeVideoLinkForm extends Vue {

    youtubeVideoUrl: string = ''

    @AsyncComputedProp()
    validations() {
        return this.validate(this.youtubeVideoUrl)
    }

    async validate(inputText) {
        const validations = {
            isUrl: false,
            isValidYoutubeVideoUrl: false,
            isEmbeddingAllowed: false,
            videoExists: false,
        };
        let url;
        try {
            url = new URL(inputText)
            validations.isUrl = true
        } catch (e) {
            return validations;
        }
        let youtubeUrl: YoutubeUrlVso;
        try {
            youtubeUrl = new YoutubeUrlVso(url)
            validations.isValidYoutubeVideoUrl = true
        } catch (e) {
            return validations
        }
        /*
        "Embedding allowed" is checked before "Video exists" because
        embedding can be cached and checking if video exists is expensive
         */
        if (EmbeddableCache.isEmbeddable(youtubeUrl.videoId)) {
            validations.isEmbeddingAllowed = true
        } else {
            return validations;
        }
        const videoInfo = await youtubeUrl.apiJson();
        if (videoInfo.pageInfo.totalResults > 0) {
            validations.videoExists = true;
        } else {
            return validations;
        }
        return validations;
    }

    @Watch('youtubeVideoUrl')
    async onYoutubeVideoUrlChange(newValue) {
        const validations = await this.validate(newValue);
        for (let validation in validations) {
            if (!validations[validation]) {
                return false;
            }
        }
        const youtubeUrl = new YoutubeUrlVso(new URL(this.youtubeVideoUrl));
        this.$emit('videoSelection', youtubeUrl)
    }

}
</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.youtube-video-link-form {
    margin-bottom: 2em;

    .youtube-video-link-input {
        outline: 0;
        display: inline-block;
        margin: 0 auto 0 auto;
        height: 3em;
        padding: .1em;
        max-width: 100%;
        width: 30em;
        box-sizing: border-box;
        font-family: 'IBM Plex Sans', 'sans-serif';
        font-weight: bold;
        color: black;
        font-size: 1.2em;
        text-align: center;

        &:focus {
            text-decoration: underline;

            &::-webkit-input-placeholder {
                visibility: hidden;
            }
        }
    }

    .youtube-video-link-errors {
        @include overwatch-futura;
        text-shadow: 0 0 .18em #ff6600;
        font-size: 1.3em;
    }

}

</style>
