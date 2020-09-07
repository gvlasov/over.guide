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
                    @done="() => onSearch(this.descriptor)"
            />
        </div>
        <div class="guide-feed root-content-panel-wrap">
            <Guide
                    v-for="guide in guides"
                    :key="guide.guideId"
                    :guide="guide"
                    :search-descriptor="descriptor"
                    @loginRequired="() => {loginRequired = true}"
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
                        <Tag :descriptor="descriptor"/>
                        <TagBadges :descriptor="descriptor"/>
                    </div>
                </div>
                Feel like
                <router-link v-bind:to="tagLink(descriptor, '/guide-editor/')">creating one</router-link>
                ?
            </WeakPanel>
            <WeakPanel slot="no-more" class="no-results">
                <div v-if="descriptor.isEmpty">
                    No more guides on the site
                </div>
                <div v-else>
                    No more guides about
                    <div class="inline-descriptor">
                        <Tag :descriptor="descriptor"/>
                        <TagBadges :descriptor="descriptor"/>
                    </div>
                </div>
                <div>
                    Feel like
                    <router-link :to="tagLink(descriptor, '/guide-editor/')">creating one</router-link>
                    ?
                </div>
            </WeakPanel>
        </InfiniteLoading>
    </div>
</template>

<script>
import InfiniteLoading from 'vue-infinite-loading'
import Backend from "@/js/Backend";
import axios from 'axios';
import DescriptorBuilder from "@/vue/guides/tags/DescriptorBuilder";
import Guide from "@/vue/guides/Guide";
import GuideVso from "@/js/vso/GuideVso";
import GuideDescriptorVso from "@/js/vso/GuideDescriptorVso";
import Tag from "@/vue/guides/tags/hero/Tag";
import TagBadges from "@/vue/guides/TagBadges";
import TagLinkMixin from "@/vue/guides/tags/TagLinkMixin";
import WeakPanel from "@/vue/guides/WeakPanel";
import LoginRequirement from "@/vue/LoginRequirement";

const backend = new Backend(axios);
export default {
    mixins: [
        TagLinkMixin,
    ],
    model: {
        prop: 'descriptor',
        event: 'descriptorChange',
    },
    props: {
        descriptor: {
            type: GuideDescriptorVso,
            required: true
        },
    },
    methods: {
        async onSearch(newDescriptor) {
            this.guides = [];
            this.page = 0;
            this.alreadyLoadedGuideIds = [];
            if (this.$refs.infiniteLoading) {
                this.$refs.infiniteLoading.stateChanger.reset();
            }
            this.$emit('contentChange');
            this.$emit('descriptorChange', newDescriptor);
        },
        async infiniteHandler($state) {
            await backend.searchGuidesPaginated({
                playerHeroes: this.descriptor.players.heroes.map(it => it.id),
                teammateHeroes: this.descriptor.teammates.heroes.map(it => it.id),
                enemyHeroes: this.descriptor.enemies.heroes.map(it => it.id),
                playerAbilities: this.descriptor.players.abilities.map(it => it.id),
                teammateAbilities: this.descriptor.teammates.abilities.map(it => it.id),
                enemyAbilities: this.descriptor.enemies.abilities.map(it => it.id),
                mapTags: this.descriptor.maps.map(it => it.id),
                thematicTags: this.descriptor.thematicTags.map(it => it.id),
                pageNumber: this.pageNumber,
                clientAlreadyHasGuideIds: this.alreadyLoadedGuideIds,
            })
                .then(page => {
                    this.page = page.pageNumber;
                    this.guides.push(...page.guides.map(guide => new GuideVso(guide)));
                    this.alreadyLoadedGuideIds.push(...page.guides.map(guide => guide.guideId))
                    if (this.guides.length > 0) {
                        $state.loaded()
                    }
                    if (page.hasNextPage === false) {
                        $state.complete()
                    }
                })
        }
    },
    watch: {
        descriptor(newValue) {
        },
    },
    data() {
        return {
            guides: [],
            pageNumber: 0,
            alreadyLoadedGuideIds: [],
            loginRequired: false,
        }
    },
    components: {
        LoginRequirement,
        TagBadges,
        Tag,
        DescriptorBuilder,
        InfiniteLoading,
        Guide,
        WeakPanel,
    },
};

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
