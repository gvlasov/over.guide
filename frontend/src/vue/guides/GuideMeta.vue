<template>
    <div class="meta">
        <GuideDescriptor
                v-hammer:tap="() => $router.push(tagLink(entry.descriptor)).catch(()=>{})"
                v-bind:class="{'same-as-search': entry.descriptor.equals(searchDescriptor)}"
                :descriptor="entry.descriptor"
        />
        <div class="authorship">
            <RelativeTime :time="creationTime"/>
            <div
                    v-if="entry.isPublic"
                    class="author">
                by
                <UserLink :user="entry.author"/>
            </div>
            <PrivateLabel v-else></PrivateLabel>
        </div>
    </div>
</template>

<script lang="ts">
import formatDistance from 'date-fns/formatDistance'
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import TagLinkMixin from "@/vue/guides/tags/TagLinkMixin";
import Authentication from "@/ts/Authentication";
import Component, {mixins} from "vue-class-component";
import {Prop} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import UserLink from "@/vue/guides/UserLink.vue";
import GuideDescriptor from "@/vue/guides/tags/GuideDescriptor.vue";
import PrivateLabel from "@/vue/guides/PrivateLabel.vue";

const auth = new Authentication();

@Component({
    components: {
        PrivateLabel,
        GuideDescriptor,
        UserLink,
        RelativeTime,
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
        padding: .13em;
        transition: padding-left .13s;

        &:hover {
            padding-left: 1em;
            transition: padding-left .13s;
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

        .private-label {
            display: block;
            margin-top: .5em;
        }

    }
}
</style>
