<template>
    <OverwatchPanel
            type="main"
            class="feed-intrusion"
    >
        <template v-if="whatToDisplay === 'ad'">
            <div ref="ad" class="feed-ad">
                this is an ad hello
                ad
            </div>
            <router-link
                    class="support-request"
                    v-if="hasAdblock"
                    :to="'/support'"
            >
                <OverwatchPanelButton
                        type="default"
                >
                    <div>
                        Blocking ads is cool, but you know what's cooler?
                    </div>
                    <div>Supporting the creator</div>
                </OverwatchPanelButton>
            </router-link>
        </template>
        <template v-else-if="whatToDisplay === 'a2hs'">
            <div class="a2hs">
                <InstallPwaButton>
                    <div>Find these guides helpful?</div>
                    <div>Add us to home screen</div>
                    <font-awesome-icon icon="tablet-alt"/>
                </InstallPwaButton>
            </div>
        </template>
    </OverwatchPanel>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import OverwatchPanel from "../general/OverwatchPanel.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";
import BackgroundHeading from "@/vue/BackgroundHeading.vue";
import InstallPwaButton from "@/vue/InstallPwaButton.vue";
import {Prop} from "vue-property-decorator";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import {FeedIntrusionType} from "@/ts/FeedIntruder";

const detectAdblock = require('vue-adblock-detect/adblock').default;

@Component({
    components: {
        OverwatchPanelButton,
        InstallPwaButton,
        BackgroundHeading,
        LinkLikeButton,
        OverwatchPanel,
    },
})
export default class FeedIntrusion extends Vue {

    @Prop({required: true})
    whatToDisplay: FeedIntrusionType

    hasAdblock: boolean = false

    beforeMount() {
        detectAdblock()
            .then(hasAdblock => {
                this.hasAdblock = hasAdblock
            })
    }


};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.feed-intrusion {
    a {
        display: block;
        text-decoration: none;
        font-size: 1rem;

        button {
            width: 100%;

            & ::v-deep .background {
                background-color: #d0a357;
            }

            & ::v-deep .content {
                padding: 1em;

                .support-request {

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
        }
    }


    .a2hs {
        button {
            width: 100%;

            & ::v-deep .content {
                justify-content: center;

                svg {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    right: 1em;
                    font-size: 2em;
                    opacity: .5;
                }
            }
        }
    }

}
</style>
