<template>
    <OverwatchDropdownButton class="hidden-comments-dropdown" :open="false">
        {{ forestSize }} more comments
    </OverwatchDropdownButton>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import CommentVso from "@/ts/vso/CommentVso";
import OverwatchDropdownButton from "../OverwatchDropdownButton.vue";
import {Prop} from "vue-property-decorator";

@Component({
    components: {
        OverwatchDropdownButton,
    }
})
export default class CommentsLevel extends Vue {

    @Prop({required: true})
    comments: CommentVso[]

    get forestSize() {
        return this.forestSizeRecursive(this.comments)
    }

    forestSizeRecursive(commentsForest: CommentVso[]) {
        if (commentsForest.length === 0) {
            return 0
        }
        return commentsForest.length + commentsForest.flatMap(c => this.forestSizeRecursive(c.children)).reduce((a, b) => a + b)

    }

}

</script>

<style lang="scss" scoped>
.hidden-comments-dropdown {
    & ::v-deep .background {
        background-color: #d0a357;
    }
}
</style>
