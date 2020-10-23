<template>
    <form class="report-creator" @submit="(e) => {e.preventDefault(); return false}">
        <div v-if="reportProgress === 'before'">
            <h2>I'm reporting this {{postTypeName}} as...</h2>
            <ul>
                <label
                        v-for="reason in reasons"
                        v-bind:for="reasonInputId(reason)"
                >
                    <input type="radio" v-bind:id="reasonInputId(reason)" name="reason" v-bind:value="reason.id" v-model="selectedReasonId">
                    <div class="name">{{ reason.label }}</div>
                    <div class="description">{{ reason.description }}</div>
                </label>
            </ul>
            <div class="buttons">
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => $emit('close')"
                >Back
                </OverwatchButton>
                <OverwatchButton
                        type="main"
                        v-hammer:tap="report"
                >Report
                </OverwatchButton>
            </div>
        </div>
        <div
                v-hammer:tap="() => $emit('close')"
                class="report-created-notification"
                v-else-if="reportProgress === 'success'"
        >Your report is accepted
            <div class="close">×</div>
        </div>
        <div
                v-hammer:tap="() => $emit('close')"
                class="report-created-notification"
                v-else-if="reportProgress === 'already-reported'"
        >You already reported this guide
            <div class="close">×</div>
        </div>
    </form>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import axios from 'axios'
import Backend from "@/ts/Backend";
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";
import Vue from 'vue'
import ReportReasonDto from "data/dto/ReportReasonDto";
import PostTypeId from "data/PostTypeId";
import ReportReasonId from "data/ReportReasonId";

const backend = new Backend(axios)

@Component({
    components: {
        OverwatchButton,
    },
})
export default class GuideButtons extends Vue {
    @Prop({required: true})
    postId: number

    @Prop({required: true})
    postTypeName: string

    @Prop({required: true})
    postTypeId: PostTypeId

    @Prop({required: true})
    reasons: ReportReasonDto[]

    selectedReasonId: ReportReasonId | null = null

    reportProgress: 'before' | 'success' | 'already-reported' = 'before'

    reasonInputId(reason: ReportReasonDto): string {
        return 'ReportReason-' + this.postId + '-' + this.postTypeId + '-' + reason.dataName;
    }

    report() {
        if (this.selectedReasonId === null) {
            throw new Error('Must select report reason')
        }
        backend.report(
            this.postTypeId,
            this.postId,
            this.selectedReasonId
        )
            .then(() => {
                this.reportProgress = 'success'
            })
            .catch((e) => {
                if (e.response.status === 422) {
                    this.reportProgress = 'already-reported'
                } else {
                    throw e;
                }
            })
    }

};

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

.report-creator {
    font-size: .8em;
    text-align: left;
    background-color: hsla(11, 39%, 44%, .97);
    padding: 1em;

    h2 {
        text-shadow: 1px 1px black;
        margin-top: 0;
    }

    ul {
        padding: 0;
        label {
            display: list-item;
            list-style: none;
            padding: .3em;

            &:hover {
                background-color: hsla(194, 60%, 39%, .3);
            }

            cursor: pointer;

            .name {
                font-weight: bold;
                display: inline-block;
                color: #ffffff;
                text-shadow: 1px 1px black;
            }

            .description {
                padding: 1em 1em 1em 4em;
            }

        }
    }

    .buttons {
        text-align: center;
    }

    .report-created-notification {
        cursor: pointer;
        text-align: center;
        @include overwatch-futura;
        font-size: 1em;

        .close {
            display: inline-block;
            margin-left: .5em;
        }
    }
}

</style>
