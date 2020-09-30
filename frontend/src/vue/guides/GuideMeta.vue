<template>
    <div class="meta">
        <div
                class="tags"
                v-hammer:tap="() => $router.push(tagLink(entry.descriptor)).catch(()=>{})"
                v-bind:class="{'same-as-search': entry.descriptor.equals(searchDescriptor)}"
        >
            <HeroTag
                    v-if="entry.descriptor.hasHeroes"
                    class="hero-tag"
                    :descriptor="entry.descriptor"
            />
            <TagBadges
                    v-if="entry.descriptor.individualTags.length > 0"
                    :descriptor="entry.descriptor"
            />
        </div>
        <div class="authorship">
            <RelativeTime :time="creationTime"/>
            <div class="author">
                by
                <UserLink :user="entry.author"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import HeroTag from "@/vue/guides/tags/hero/HeroTag";
import formatDistance from 'date-fns/formatDistance'
import TagBadges from "@/vue/guides/TagBadges";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import TagLinkMixin from "@/vue/guides/tags/TagLinkMixin";
import Authentication from "@/ts/Authentication";
import Component, {mixins} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import UserLink from "@/vue/guides/UserLink.vue";

const auth = new Authentication();

@Component({
    components: {
        UserLink,
        RelativeTime,
        TagBadges,
        HeroTag,
    },
})
export default class GuideMeta extends mixins(TagLinkMixin) {
    @Prop({required: true})
    entry: ExistingGuideHistoryEntryVso

    @Prop({required: true})
    creationTime: Date

    @Prop({required: true})
    searchDescriptor: GuideDescriptorVso | null

    declare $router: any


    creationTimeRelative(): string {
        return formatDistance(this.entry.createdAt, new Date());
    }

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.meta {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    color: white;
    justify-content: space-between;
    margin: .3em 0 .3em 0;
    gap: .5em;


    .tags {
        overflow: hidden;
        display: flex;
        gap: .5em;
        align-items: center;
        text-align: left;
        cursor: pointer;
        padding-left: 0;
        transition: padding-left .13s;

        &:hover {
            padding-left: 1em;
            transition: padding-left .13s;
        }

        .hero-tag {
            display: inline-block;
        }

        &.same-as-search:hover {
            transform: translateX(0) rotateY(0deg);
            transition: transform .13s ease-in-out !important;
        }

        &.same-as-search:active {
            transform: rotate3d(1, 0, 0, 90deg);
            transition: transform .13s step-start !important;
        }

    }

    .authorship {
        white-space: nowrap;
        @include overwatch-futura-no-smallcaps;

    }
}
</style>
