<template>
    <OverwatchPanel class="guide-preview">
        <GuideMeta
                :entry="metaEntry"
                :search-descriptor="searchDescriptor"
                :creation-time="nowTime"
        />
        <GuideContent
                :entry="head.entry"
        />

        <div class="footer">
            <div class="buttons">
                <Upvoter
                        :post-id="-1"
                        :post-type-id="PostTypeId.Guide"
                        @upvote="() => void 0"
                        @upvoteRemoved="() => void 0"
                />
                <div class="votes-count">{{ 0 }}</div>
                <TrainingGoalButton
                        :entry="head.entry"
                        :idle="true"
                />
            </div>
            <div class="comments">
                <CommentsButton
                        :comments-count="head.commentsCount"
                />
            </div>
        </div>
    </OverwatchPanel>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import GuidePartText from "@/vue/guides/GuidePartText";
import GuideVideo from "@/vue/guides/GuideVideo";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import GuideMeta from "@/vue/guides/GuideMeta.vue";
import Vue from 'vue'
import GuideContent from "@/vue/guides/GuideContent.vue";
import CommentsButton from "@/vue/guides/CommentsButton.vue";
import CommentsSection from "@/vue/comments/CommentsSection.vue";
import NewGuideHeadVso from "../../ts/vso/NewGuideHeadVso";
import ExistingGuideHistoryEntryVso
    from "@/ts/vso/ExistingGuideHistoryEntryVso";
import GuideDto from "data/dto/GuideDto";
import UserDto from "data/dto/UserDto";
import Authentication from "@/ts/Authentication";
import TrainingGoalButton from "@/vue/guides/TrainingGoalButton.vue";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import Upvoter from "@/vue/comments/Upvoter.vue";
import PostTypeId from 'data/PostTypeId'


@Component({
    components: {
        OverwatchPanel,
        TrainingGoalButton,
        CommentsSection,
        CommentsButton,
        GuideContent,
        GuideMeta,
        GuideVideo,
        GuidePartText,
        OverwatchButton,
        Upvoter,
    },
})
export default class GuidePreview extends Vue {

    PostTypeId = PostTypeId

    @Prop({required: true})
    head: NewGuideHeadVso


    get metaEntry(): ExistingGuideHistoryEntryVso {
        return new ExistingGuideHistoryEntryVso({
            ...this.head.entry.toDto(),
            guide: {
                createdAt: new Date().toISOString(),
                author: {
                    id: new Authentication().userId || 0,
                    name: new Authentication().username || 'you',
                } as UserDto,
                id: 0,
                isPublic: this.head.entry.isPublic,
            } as GuideDto,
            updatedAt: new Date().toISOString()
        })
    }

    @Prop()
    searchDescriptor: GuideDescriptorVso | null

    showCommentsSection: boolean = false

    get nowTime(): Date {
        return new Date()
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/fonts.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

.guide-preview {
    display: inline-block;
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

        .training-goal-button {
            font-size: 1.5rem;
        }

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


    .footer {
        border-top: 1px solid hsla(0, 0, 100%, .2);
        display: flex;
        flex-wrap: wrap;
        padding-top: 1em;

        .buttons {
            flex-grow: 1;
            text-align: left;
            display: flex;
            align-items: center;

            .votes-count {
                padding-left: .5em;
                padding-right: 1.5em;
                font-weight: bold;
                font-size: 1.4em;
                @include overwatch-futura;
            }

            .upvoter {
                display: inline-block;
            }

            .training-goal-button {
                display: inline-block;
            }
        }

        .comments {
            text-align: right;

            button {
                font-size: 1.5em;
            }
        }
    }
}

</style>
