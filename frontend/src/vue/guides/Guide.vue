<template>
    <div class="guide">
        <GuideMeta
                :entry="head.entry"
                :search-descriptor="searchDescriptor"
                :creation-time="head.entry.createdAt"
        />
        <GuideButtons :entry="head.entry"/>
        <GuideContent
                :entry="head.entry"
        />
        <div class="comments">
            <CommentsSection
                    v-if="showCommentsSection"
                    :post="head"
                    @close="() => showCommentsSection = false"
            />
            <CommentsButton
                    v-else
                    :comments-count="head.commentsCount"
                    v-hammer:tap="() => showCommentsSection = !showCommentsSection"
            />
        </div>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import MyTrainingGoalsCache from "@/ts/MyTrainingGoalsCache";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuidePartText from "@/vue/guides/GuidePartText";
import Authentication from "@/ts/Authentication";
import axios from 'axios'
import Backend from "@/ts/Backend";
import GuideVideo from "@/vue/guides/GuideVideo";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import GuideMeta from "@/vue/guides/GuideMeta.vue";
import Vue from 'vue'
import GuideContent from "@/vue/guides/GuideContent.vue";
import CommentsButton from "@/vue/guides/CommentsButton.vue";
import CommentsSection from "@/vue/comments/CommentsSection.vue";
import GuideButtons from "@/vue/guides/GuideButtons.vue";

const myTrainingGoalsCache = MyTrainingGoalsCache.instance()
const auth = new Authentication();
const backend = new Backend(axios)

@Component({
    components: {
        GuideButtons,
        CommentsSection,
        CommentsButton,
        GuideContent,
        GuideMeta,
        GuideVideo,
        GuidePartText,
        OverwatchButton,
    },
})
export default class Guide extends Vue {
    @Prop({required: true})
    head: ExistingGuideHeadVso

    @Prop()
    searchDescriptor: GuideDescriptorVso | null

    showCommentsSection: boolean = false

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

.guide {
    @include overwatch-panel;
    display: block;
    box-sizing: border-box;
    color: white;
    padding: 1em;

    .descriptor-builder {
        z-index: 1;
        position: relative;
        width: 100%;
        margin-bottom: 1rem;
        /* For it to be positioned above everything else,
               which is important when the dropdown is displayed
               */
    }

    .training-goal-buttons {
        text-align: right;
        margin-bottom: 1rem;

        $training-goal-color: #edad4c;

        .remove-training-goal-button {

            @include overwatch-inline-button;

            & ::v-deep .background {
                background-color: $training-goal-color;
            }

            &:hover ::v-deep .background {
                background-color: $training-goal-color;
            }
        }
    }

    .comments {
        padding-top: 1em;
        text-align: right;

        button {
            font-size: 1.5em;
        }
    }
}

</style>
