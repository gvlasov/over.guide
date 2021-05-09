<template>
    <ul class="thumbnail-method-selector">
        <li>
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => $emit('select-moment-auto')"
            >Auto
            </OverwatchButton>
        </li>
        <li>
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => $emit('select-moment-custom')"
                    :disabled="disableMoment"
            >Moment from video
            </OverwatchButton>
        </li>
        <li>
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => $emit('select-original')"
            >Original Youtube thumbnail
            </OverwatchButton>
        </li>
        <li>
            <OverwatchButton
                    type="default"
                    v-hammer:tap="() => $emit('select-image-custom')"
            >Upload image
            </OverwatchButton>
        </li>
    </ul>
</template>

<script lang="ts">
import OverwatchButton from "@/vue/OverwatchButton";
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop} from "vue-property-decorator";

@Component({
    components: {
        OverwatchButton,
    }
})
export default class ThumbnailMethodSelector extends Vue {
    @Prop({default: false})
    disableMoment: boolean

}

</script>

<style lang="scss" scoped>

ul.thumbnail-method-selector {
    text-align: left;
    width: 20em;
    padding: 0;
    margin: 0;

    li {
        list-style-type: none;
        margin-bottom: .4em;

        button {
            font-size: 1.3em;
            height: 2em;
        }
    }
}

</style>
