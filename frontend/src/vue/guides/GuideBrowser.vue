<template>
    <div class="guide-browser root-content-sizer">
        <LoginRequirement
                v-if="loginRequired"
                @back="() => {loginRequired = false}"
        >
            <template v-slot:notice>To change your training goals, log in to your account</template>
        </LoginRequirement>
        <DescriptorBuilder
                :search-button-enabled="false"
                v-model="localDescriptor"
        />
        <div class="guide-feed">
            <template
                    v-for="(head, index) in feed.items"
            >
                <Guide
                        :key="head.guideId"
                        :head="head"
                        :search-descriptor="descriptor"
                        @loginRequired="() => {loginRequired = true}"
                        @guideDeactivated="feed.removeElementById"
                        @comesIntoVision="onComesIntoVision"
                        @comesOutOfVision="onComesOutOfVision"
                        @play="(player) => pauseOther(player)"
                        @playerReady="(player) => players.push(player)"
                />
                <FeedIntrusion
                        v-if="intruder.intrusionForIndex(index) !== null"
                        :what-to-display="intruder.intrusionForIndex(index)"
                />
            </template>
        </div>
        <InfiniteLoading
                ref="infiniteLoading"
                direction="bottom"
                @infinite="(state) => feed.loadNextPage(state)"
        >
            <SpinnerBlock slot="spinner"/>
            <WeakPanel slot="no-results" class="no-results">
                <div v-if="descriptor.isEmpty">
                    No guides on the site
                </div>
                <div v-else>
                    No guides about
                    <div class="inline-descriptor">
                        <HeroTag :descriptor="descriptor"/>
                        <TagBadges :descriptor="descriptor"/>
                    </div>
                </div>
                Feel like
                <router-link v-bind:to="tagLink(descriptor, '/guide-editor/new/')">creating one</router-link>
                ?
            </WeakPanel>
            <WeakPanel slot="no-more" class="no-results">
                <div v-if="descriptor.isEmpty">
                    No more guides on the site
                </div>
                <div v-else>
                    No more guides about
                    <div class="inline-descriptor">
                        <HeroTag :descriptor="descriptor"/>
                        <TagBadges :descriptor="descriptor"/>
                    </div>
                </div>
                <div>
                    Feel like
                    <router-link :to="tagLink(descriptor, '/guide-editor/new/')">creating one</router-link>
                    ?
                </div>
            </WeakPanel>
        </InfiniteLoading>
    </div>
</template>

<script lang="ts">
import InfiniteLoading from 'vue-infinite-loading'
import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
import Guide from "@/vue/guides/Guide";
import HeroTag from "@/vue/guides/tags/hero/HeroTag";
import TagBadges from "@/vue/guides/TagBadges";
import TagLinkMixin from "@/vue/guides/tags/TagLinkMixin";
import WeakPanel from "@/vue/guides/WeakPanel";
import LoginRequirement from "@/vue/LoginRequirement";
import ViewportPositionY from "@/ts/ViewportPositionY";
import minBy from 'lodash.minby'
import {debounce} from "lodash/function";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import {Model, Ref, Watch} from "vue-property-decorator";
import Component, {mixins} from "vue-class-component";
import ModalBackground from "@/vue/general/ModalBackground.vue";
import GuideSearchFeedVso from "@/ts/vso/GuideSearchFeedVso";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import FeedIntrusion from "@/vue/guides/FeedIntrusion.vue";
import SpinnerBlock from "@/vue/SpinnerBlock.vue";
import FeedIntruder from "@/ts/FeedIntruder";

const playingZonePaddingPx = 50;
@Component({
    components: {
        SpinnerBlock,
        FeedIntrusion,
        OverwatchPanel,
        ModalBackground,
        LoginRequirement,
        TagBadges,
        HeroTag,
        DescriptorBuilder,
        InfiniteLoading,
        Guide,
        WeakPanel,
    },
})
export default class GuideBrowser extends mixins(TagLinkMixin) {
    @Ref('infiniteLoading')
    infiniteLoading: InfiniteLoading

    @Model('descriptorChange', {required: true})
    descriptor: GuideDescriptorVso

    feed = new GuideSearchFeedVso(this.descriptor, false)

    intruder = new FeedIntruder()

    loginRequired: boolean = false
    visibleVideos: any = []
    bodyRect: DOMRect = document.body.getBoundingClientRect()
    currentlyPlayingVideo: any = null
    players: YT.Player[] = []

    get localDescriptor(): GuideDescriptorVso {
        return this.descriptor
    }

    set localDescriptor(descriptor: GuideDescriptorVso) {
        if (descriptor.hash !== this.descriptor.hash) {
            this.$emit('descriptorChange', descriptor)
        }
    }

    updatePlayingVideoIfNecessary() {
        if (
            this.currentlyPlayingVideo !== null
            && !this.visibleVideos.includes(this.currentlyPlayingVideo)
        ) {
            this.currentlyPlayingVideo.pause()
            this.currentlyPlayingVideo = null;
        }
        const videoThatMustBePlaying = minBy(
            this.visibleVideos,
            (video) => {
                return Math.abs(
                    ViewportPositionY.center - (video.boundingClientRect().y - video.boundingClientRect().height / 2 + window.scrollY)
                );
            }
        )
        if (
            videoThatMustBePlaying === void 0
            || videoThatMustBePlaying === this.currentlyPlayingVideo
        ) {
            return;
        }
        if (
            this.currentlyPlayingVideo !== null
            && videoThatMustBePlaying !== this.currentlyPlayingVideo
        ) {
            this.currentlyPlayingVideo.pause()
            this.currentlyPlayingVideo = null;
        }
        this.currentlyPlayingVideo = videoThatMustBePlaying
        videoThatMustBePlaying.play()
    }

    onComesIntoVision(video) {
        this.visibleVideos.push(video)
    }

    onComesOutOfVision(video) {
        const index = this.visibleVideos.findIndex(it => it.playerId === video.playerId)
        if (index > -1) {
            this.visibleVideos.splice(index, 1)
        }
    }

    pauseOther(player) {
        for (let otherPlayer of this.players) {
            if (player !== otherPlayer) {
                otherPlayer.pauseVideo();
            }
        }
    }

    get viewportPositionY() {
        return {
            y: ViewportPositionY.y,
            height: ViewportPositionY.height,
        };
    }

    get updatePlayingVideoIfNecessary_debounced() {
        return debounce(() => {
            this.updatePlayingVideoIfNecessary()
        }, 100)
    }

    @Watch('descriptor', {deep: true})
    onDescriptorChange(newDescriptor: GuideDescriptorVso) {
        this.$emit('contentChange');
        this.$emit('descriptorChange', newDescriptor);
        this.visibleVideos.slice(0, this.visibleVideos.length)
        this.players.slice(0, this.players.length)
        this.feed.reset(this.infiniteLoading.stateChanger)
        this.feed.descriptor = newDescriptor
    }

    mounted() {
        window.addEventListener('scroll', this.updatePlayingVideoIfNecessary_debounced)
        window.addEventListener('resize', this.updatePlayingVideoIfNecessary_debounced)
    }

    destroyed() {
        window.removeEventListener('scroll', this.updatePlayingVideoIfNecessary_debounced)
        window.removeEventListener('resize', this.updatePlayingVideoIfNecessary_debounced)
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

.guide-feed {
    display: flex;
    justify-content: start;
    flex-direction: column;
    gap: 2rem;
    margin-top: 2rem;
    margin-bottom: 3rem;

    .guide {
        max-width: 100vw;
        min-width: 100%;
    }
}

.guide-browser {
    margin: 0 auto;
}


.weak-panel {

    & ::v-deep .inline-descriptor {
        display: inline-flex;
        align-items: center;
        gap: .5em;
        margin-left: .4em;
        vertical-align: middle;
        font-size: .5em;
        white-space: nowrap;

        & > * {
            line-height: 1em;
            vertical-align: bottom;
        }
    }
}
</style>
