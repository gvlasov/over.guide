<template>
    <div
            class="sentence-constructor"
    >
        <div class="action-buttons">
            <h3>
                <slot/>
            </h3>
            <ul class="punishment-options">
                <OverwatchPanelButton
                        v-for="type in availableRestrictionTypes"
                        :key="'restriction-type'+type.id"
                        type="default"
                        class="restriction-option"
                        v-hammer:tap="() => selectRestriction(type)"
                >{{ type.labelFormat }}
                </OverwatchPanelButton>
                <OverwatchPanelButton
                        v-for="type in availableImmediateActionTypes"
                        :key="'immediate-action-type'+type.id"
                        type="default"
                        class="immediate-action-option"
                        v-hammer:tap="() => selectImmediateAction(type)"
                >{{ type.labelFormat }}
                </OverwatchPanelButton>
            </ul>
        </div>
        <div
                v-if="showSentence"
                class="sentence"
        >
            <h3>Sentence</h3>
            <ul class="sentence-items">
                <li
                        v-for="restriction in selectedRestrictions"
                        :key="restriction.typeId"
                        class="selected-restriction"
                >
                    {{ restriction.type.labelFormat }}
                    for
                    <input type="number" min="1" v-model.number="restriction.durationDays"/> days
                    <span
                            class="close-button"
                            v-hammer:tap="() => unselectRestriction(restriction)"
                    >×</span>
                </li>
                <li
                        v-for="action in selectedImmediateActions"
                        :key="action.typeId"
                        class="selected-immediate-action"
                >
                    {{ action.type.labelFormat }}
                    <span
                            class="close-button"
                            v-hammer:tap="() => unselectImmediateAction(action)"
                    >×</span>
                </li>
            </ul>
            <OverwatchButton
                    type="main"
                    v-hammer:tap="issueSentence"
                    :disabled="!issueButtonEnabled"
            >Issue
            </OverwatchButton>
        </div>
        <ul class="sentence">
        </ul>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import reportReasons from 'data/reportReasons'
import PostTypeId from "data/PostTypeId";
import Guide from "@/vue/guides/Guide.vue";
import ExistingGuideHeadVso from "@/ts/vso/ExistingGuideHeadVso";
import Comment from "@/vue/comments/Comment.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import {Prop} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import RestrictionTypeDto from "data/dto/RestrictionTypeDto";
import restrictionTypes from 'data/restrictionTypes'
import immediateActionTypes from 'data/immediateActionTypes'
import ImmediateActionTypeDto from "data/dto/ImmediateActionTypeDto";
import RestrictionCreateVso from "@/ts/vso/RestrictionCreateVso";
import ImmediateActionCreateVso from "@/ts/vso/ImmediateActionCreateVso";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import OverwatchPanelButton from "@/vue/OverwatchPanelButton.vue";
import Backend from "@/ts/Backend";
import UserVso from "@/ts/vso/UserVso";

@Component({
    components: {
        OverwatchPanelButton,
        OverwatchButton,
        RelativeTime,
        UserLink,
        LinkLikeButton,
        Comment,
        Guide,
    },
})
export default class SentenceConstructor extends Vue {

    ExistingGuideHeadVso = ExistingGuideHeadVso

    PostTypeId = PostTypeId

    reportReasons = reportReasons

    @Prop({
        default: () => Array.from(restrictionTypes.values()),
    })
    restrictionTypes: RestrictionTypeDto[]

    @Prop({
        default: () => Array.from(immediateActionTypes.values())
    })
    immediateActionTypes: ImmediateActionTypeDto[]

    @Prop({required: true})
    objectId: number | null

    @Prop({required: true})
    defender: UserVso

    selectedRestrictions: RestrictionCreateVso[] = []

    selectedImmediateActions: ImmediateActionCreateVso[] = []

    get availableRestrictionTypes(): RestrictionTypeDto[] {
        return this.restrictionTypes.filter(
            type => this.selectedRestrictions.find(r => r.typeId === type.id) === void 0
        )
    }

    get availableImmediateActionTypes(): ImmediateActionTypeDto[] {
        return this.immediateActionTypes.filter(
            type => this.selectedImmediateActions.find(r => r.typeId === type.id) === void 0
        )
    }

    selectRestriction(type: RestrictionTypeDto) {
        this.selectedRestrictions.push(
            new RestrictionCreateVso(
                type.id,
                this.objectId
            )
        )
    }

    selectImmediateAction(type: ImmediateActionTypeDto) {
        this.selectedImmediateActions.push(
            new ImmediateActionCreateVso(
                {
                    typeId: type.id,
                    objectId: this.objectId,
                }
            )
        )
    }

    unselectRestriction(restriction: RestrictionCreateVso) {
        this.selectedRestrictions.splice(
            this.selectedRestrictions.findIndex(
                selectedRestriction => selectedRestriction.typeId === restriction.typeId
            ),
            1
        )
    }

    unselectImmediateAction(action: ImmediateActionCreateVso) {
        this.selectedImmediateActions.splice(
            this.selectedImmediateActions.findIndex(
                selectedAction => selectedAction.typeId === action.typeId
            ),
            1
        )
    }

    issueSentence() {
        return Backend.instance
            .createSentence(
                {
                    immediateActions: this.selectedImmediateActions.map(it => it.toDto()),
                    restrictions: this.selectedRestrictions.map(it => it.toDto()),
                    judgeCommentary: null,
                    defenderId: this.defender.id,
                }
            )
            .then(() => {
                this.$emit('created')
            })
    }

    get showSentence(): boolean {
        return this.selectedRestrictions.length > 0 || this.selectedImmediateActions.length > 0
    }

    get issueButtonEnabled() {
        return this.selectedRestrictions.length + this.selectedImmediateActions.length > 0 &&
            this.selectedRestrictions.every(restriction => Number.isFinite(restriction.durationDays) && restriction.durationDays > 0);
    }
}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';

.sentence-constructor {
    @mixin body-text-button($base-bg-color) {
        & ::v-deep .background {
            background-color: rgba($base-bg-color, .4)
        }
        & ::v-deep .content {
            font-family: "IBM Plex Sans", 'sans-serif';
            font-size: 1rem;
            letter-spacing: initial;
            font-variant-caps: initial;
        }
    }

    .action-buttons {
        text-align: left;
        padding: 0 1em 1em 1em;

        .punishment-options {
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            width: 100%;
            gap: .9em;

            & > button {
                cursor: pointer;
                display: block;
                width: 8em;
                text-align: center;
            }

            text-align: center;

            & > .restriction-option {
                @include body-text-button(hsl(0, 100%, 50%));
            }

            & > .immediate-action-option {
                @include body-text-button(hsl(25, 100%, 50%));
            }
        }
    }

    .sentence {
        .sentence-items {
            padding: 0;
            margin: 0 0 1em 0;
            display: flex;
            flex-wrap: wrap;
            gap: .9em;
            justify-content: center;
            list-style: none;

            & > li {
                font-weight: bold;
                text-align: center;
                padding: .5em;
            }

            span.close-button {
                display: block;
                text-align: center;
                cursor: pointer;

                &:hover {
                    color: black;
                }
            }

            input[type=number] {
                width: 4em;
                // https://www.w3schools.com/howto/howto_css_hide_arrow_number.asp
                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                -moz-appearance: textfield;
            }

            .selected-restriction {
                background-color: hsla(0, 100%, 50%, .4);
            }

            .selected-immediate-action {
                background-color: hsla(25, 100%, 50%, .4);
            }
        }
    }

}
</style>
