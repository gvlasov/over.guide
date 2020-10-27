<template>
    <div class="linked-descriptor-suggestion-selector">
        <ParameterDescriptorSynchronizer
                v-model="descriptor"
                :write-params-to-descriptor="true"
                base-path="/guide-editor/"
        />
        <div
                v-if="!descriptor.isEmpty"
                class="descriptor-wrap"
                v-hammer:tap="() => confirming = true"
        >
            <GuideDescriptor :descriptor="descriptor"/>
        </div>
        <button
                v-hammer:tap="() => $emit('dismiss')"
        >×</button>
        <NotificationModalPopup
                v-if="confirming"
                @close="() => confirming = false"
        >
            <div class="confirmation">
                Ditch current draft and create new guide about
                <GuideDescriptor :descriptor="descriptor"/>
                ?
                <div class="buttons">
                    <OverwatchButton
                            type="main"
                            v-hammer:tap="() => $emit('select', descriptor)"
                    >Ditch
                    </OverwatchButton>
                    <OverwatchButton
                            type="default"
                            v-hammer:tap="() => confirming = false"
                    >Back
                    </OverwatchButton>
                </div>
            </div>
        </NotificationModalPopup>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePart from "@/vue/guides/GuidePart";
import Component, {mixins} from 'vue-class-component'
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";
import GuideDescriptorVso from "@/ts/vso/GuideDescriptorVso";
import ParameterDescriptorSynchronizer
    from "@/vue/guides/ParameterDescriptorSynchronizer.vue";
import GuideDescriptor from "@/vue/guides/tags/GuideDescriptor.vue";
import ParamsDescriptorMixin from "@/ts/ParamsDescriptorMixin";
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";


@Component({
    components: {
        NotificationModalPopup,
        GuideDescriptor,
        OverwatchPanel,
        GuidePart,
        OverwatchButton,
        ParameterDescriptorSynchronizer
    },
})
export default class LinkedDescriptorSuggestionSelector extends mixins(ParamsDescriptorMixin) {
    descriptor: GuideDescriptorVso =
        new GuideDescriptorVso(
            this.obtainParamsDescriptor(this.$route.params.descriptor)
        )

    confirming: boolean = false
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.linked-descriptor-suggestion-selector {
    color: black;
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-left: .4em;
    gap: .4em;

    button {
        width: 1.4em;
        font-size: 3em;
        line-height: 0;
        color: white;
        background: hsla(38, 56%, 58%, .8);
        border: 0;
        cursor: pointer;
        border-radius: .4rem;
        box-shadow: 0 0 .06em #343434;
    }

    .descriptor-wrap {
        cursor: pointer;

        .tags {
            position: relative;
            top: 0;
        }
        &:hover .tags {
            top: -.3em;
            transition: top .14s;
        }
    }
}

.confirmation {
    text-align: center;
    background-color: hsl(0, 0%, 20%, .92);
    padding: 1em;
    @include overwatch-futura-no-smallcaps;

    .tags {
        display: inline-block;
        font-size: .7rem;
        vertical-align: middle;
    }

    .buttons {
        padding-top: 1em;
    }
}
</style>
