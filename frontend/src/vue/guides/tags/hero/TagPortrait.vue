<template>
    <div
            style="display: table-cell"
    >
        <HeroPortrait
                class="portrait"
                :hero="hero"
                :base-url="'/images/roster-portraits'"
        />
    </div>
</template>

<script lang="ts">
import HeroPortrait from "@/vue/HeroPortrait";
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import HeroDto from "../../../../../../backend/src/data/dto/HeroDto";
import Component from "vue-class-component";

@Component({
    components: {
        HeroPortrait,
    },
})
export default class TagPortrait extends Vue {
    @Prop({required: true})
    hero: HeroDto
};
</script>

<style lang="scss" scoped>
@import '~@/assets/css/tags.scss';

.portrait {
    display: table-cell;
    height: 100%;
    width: auto;
    vertical-align: middle;
}
</style>
