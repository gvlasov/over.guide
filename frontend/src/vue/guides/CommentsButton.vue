<template>
    <OverwatchButton type="default" class="comments-button">
        {{ commentsCount }} comments
    </OverwatchButton>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import OverwatchButton from "@/vue/OverwatchButton.vue";

@Component({
    components: {OverwatchButton},
})
export default class CommentsButton extends Vue {

    @Prop({required: true})
    commentsCount: number

}

</script>

<style lang="scss" scoped>
</style>
