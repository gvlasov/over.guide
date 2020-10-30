<template>
    <OverwatchPanelButton
            type="main"
            class="feed-intrusion"
    >
        <div ref="ad" class="feed-ad">
            this is an ad hello
            ad
        </div>
        <router-link
                class="support-request"
                v-if="hasAdblock"
                :to="'/support'"
        >
            <div>
                Blocking ads is cool, but you know what's cooler?
            </div>
            <BackgroundHeading>Supporting the creator</BackgroundHeading>
        </router-link>
    </OverwatchPanelButton>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import OverwatchPanel from "../general/OverwatchPanel.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import BackgroundHeading from "@/vue/BackgroundHeading.vue";

const detectAdblock = require('vue-adblock-detect/adblock').default;

@Component({
    components: {
        BackgroundHeading,
        OverwatchPanelButton,
        LinkLikeButton,
        OverwatchPanel,
    },
})
export default class FeedIntrusion extends Vue {

    hasAdblock: boolean = false

    beforeMount() {
        detectAdblock()
            .then(hasAdblock => {
                this.hasAdblock = hasAdblock
                console.log(this.hasAdblock)
            })
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.feed-intrusion {
    & ::v-deep .content {
        padding: 1em;
        font-variant-caps: normal;
        font-family: "IBM Plex Sans", sans-serif;
        .support-request {
            display: block;
            text-decoration: none;
            font-size: 1rem;

            &:hover {
                text-decoration: none;
                color: white;
            }

            .background-heading {
                font-size: 2.2em;
                text-decoration: underline;
                font-variant-caps: all-small-caps;
                font-family: 'BigNoodleTooOblique', 'sans-serif';
                text-align: center;
                opacity: 1;
            }

        }
    }
    & ::v-deep .background {
        background-color: hsla(0, 70%, 29%, .8);
    }

}
</style>
