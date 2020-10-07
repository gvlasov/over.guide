<template>
    <div class="guide-browser root-content-sizer">
        <LoginRequirement
                v-if="loginRequired"
                @back="() => {loginRequired = false}"
        >
            <template v-slot:notice>To change your training goals, log in to your account</template>
        </LoginRequirement>
        <div class="root-content-panel-wrap">
            <DescriptorBuilder
                    :search-button-enabled="false"
                    :descriptor="descriptor"
            />
        </div>
        <div class="guide-feed root-content-panel-wrap">
            <Guide
                    v-for="guide in guides"
                    :key="guide.guideId"
                    :head="guide"
                    :search-descriptor="descriptor"
                    @loginRequired="() => {loginRequired = true}"
                    @guideDeactivated="onDeactivated"
                    @comesIntoVision="onComesIntoVision"
                    @comesOutOfVision="onComesOutOfVision"
                    @play="(player) => pauseOther(player)"
                    @playerReady="(player) => players.push(player)"
            />
        </div>
        <InfiniteLoading
                ref="infiniteLoading"
                direction="bottom"
                @infinite="infiniteHandler"
                class="root-content-panel-wrap"
                force-use-infinite-wrapper
        >
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
import InfiniteGuideSearchMixin
    from "@/vue/guides/editor/InfiniteGuideSearchMixin";
import ViewportPositionY from "@/ts/ViewportPositionY";
import minBy from 'lodash.minby'
import {debounce} from "lodash/function";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import {Model, Watch} from "vue-property-decorator";
import Component, {mixins} from "vue-class-component";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import LoginNotice from "@/vue/LoginNotice.vue";
import ModalBackground from "@/vue/ModalBackground.vue";

const playingZonePaddingPx = 50;
@Component({
    components: {
        ModalBackground,
        LoginNotice,
        LoginRequirement,
        TagBadges,
        HeroTag,
        DescriptorBuilder,
        InfiniteLoading,
        Guide,
        WeakPanel,
    },
})
export default class GuideBrowser extends mixins(TagLinkMixin, InfiniteGuideSearchMixin) {
    @Model('descriptorChange', {required: true})
    descriptor: GuideDescriptorVso

    loginRequired: boolean = false
    visibleVideos: any = []
    bodyRect: DOMRect = document.body.getBoundingClientRect()
    currentlyPlayingVideo: any = null
    players: YT.Player[] = []

    declare guides: ExistingGuideHistoryEntryVso[]

    async onSearch(newDescriptor: GuideDescriptorVso) {
        this.$emit('contentChange');
        this.$emit('descriptorChange', newDescriptor);
        this.visibleVideos.slice(0, this.visibleVideos.length)
        this.players.slice(0, this.players.length)
    }

    onDeactivated(guideId: number) {
        const deactivated = this.guides.findIndex(g => g.guideId === guideId)
        if (deactivated === -1) {
            throw new Error('Unknown guide deactivated')
        }
        this.guides.splice(deactivated, 1)
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
    onDescriptorChange(newValue: GuideDescriptorVso) {
        (InfiniteGuideSearchMixin as any).options.methods.onDescriptorChange.call(this, newValue)
        this.onSearch(newValue)
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
