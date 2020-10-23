<template>
    <div class="part-spawner">
        <OverwatchPanel
                v-if="seeding"
                class="seed"
                v-bind:style="{order: where === ListPosition.Beginning ? 2 : 1}"
        >
            <OverwatchButton
                    type="default"
                    class="button-add-text"
                    v-hammer:tap="() => {$emit('addText', where); seeding = false}"
                    data-type="text"
            >text
            </OverwatchButton>
            <a
                    v-if="!initialSeeding"
                    class="close-button"
                    v-hammer:tap="() => seeding = false"
            >x</a>
            <OverwatchButton
                    type="default"
                    class="button-add-video"
                    data-type="video"
                    v-hammer:tap="() => {$emit('addVideo', where); seeding = false}"
            >video
            </OverwatchButton>
        </OverwatchPanel>
            <div
                    v-if="!seeding"
                    class="new-buttons"
                    v-bind:style="{order: where === ListPosition.Beginning ? 1 : 2}"
            >
                <OverwatchButton
                        type="default"
                        v-hammer:tap="() => seeding = true"
                >Add
                </OverwatchButton>
            </div>
    </div>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import GuidePart from "@/vue/guides/GuidePart";
import Vue from 'vue'
import Component from 'vue-class-component'
import {Prop, Watch} from "vue-property-decorator";
import ListPosition from "@/ts/ListPosition";
import OverwatchPanel from "@/vue/general/OverwatchPanel.vue";


@Component({
    components: {
        OverwatchPanel,
        GuidePart,
        OverwatchButton,
    },
})
export default class GuidePartSpawner extends Vue {

    ListPosition = ListPosition

    @Prop({required: true})
    initialSeeding: boolean

    @Prop({required: true})
    where: ListPosition

    seeding: boolean = this.initialSeeding

    @Watch('initialSeeding')
    onInitialSeedingChange(newValue) {
        this.seeding = newValue;
    }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';
@import '~@/assets/css/overwatch-ui.scss';
@import '~@/assets/css/tags.scss';

.part-spawner {
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    align-items: stretch;
    padding: 0 0 0 0;

    .seed, .new-buttons, .part-spawner {
        max-height: 5em;
        min-height: 5em;
        box-sizing: border-box;
    }

    .seed {
        flex: 0 0 100%;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;
        padding-bottom: 1rem;
        padding-top: 1rem;
        position: relative;

        .close-button {
            @include overwatch-futura;
            cursor: pointer;
            padding: 1rem;
        }

        .create-new-heading {
            font-size: 2em;
            @include overwatch-futura;
            flex-basis: 100%;
            position: absolute;
            top: 0;
        }

        button {
            flex-basis: 30%;
            font-size: 2.6em;
        }
    }

    .new-buttons {
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        overflow: hidden;
        flex: 0 0 100%;
        z-index: 1;
    }

}
</style>
