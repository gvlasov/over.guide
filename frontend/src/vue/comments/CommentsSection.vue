<template>
    <div class="comment-section" v-resize="onResize">
        <CommentForm
                :post="post"
                :comments-level="firstLevelComments"
                :parent="post"
                @cancel="() => $emit('close')"
                close-button-text="close"
        />
        <div v-if="!$asyncComputed.firstLevelComments.success">Loading</div>
        <CommentsLevel
                v-else-if="firstLevelComments.length > 0"
                class="first-comments-level"
                :comments="firstLevelComments"
                :parent="post"
                :post="post"
                :level="0"
                :last-nesting-level="lastNestingLevel"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import CommentVso from "@/ts/vso/CommentVso";
import AsyncComputedProp from 'vue-async-computed-decorator'
import CommentForest from "@/ts/vso/CommentForest";
import CommentsLevel from "@/vue/comments/CommentsLevel.vue";
import PostVso from "@/ts/vso/PostVso";
import CommentForm from "@/vue/comments/CommentForm.vue";
import Backend from "@/ts/Backend";

@Component({
    components: {CommentForm, CommentsLevel}
})
export default class CommentsSection extends Vue {
    @Prop({required: true})
    post: PostVso

    declare firstLevelComments: CommentVso[]

    @AsyncComputedProp()
    async firstLevelComments() {
        return Backend.instance.getComments(this.post)
            .then(dtos => new CommentForest(dtos).firstLevelComments)
    }

    clientWidth: number = 0

    get lastNestingLevel(): number {
        const level = (this.clientWidth / this.fontSizePx - 32) / 3;
        console.log(level)
        return level
    }

    get fontSizePx(): number {
        return Number.parseInt(
            getComputedStyle(this.$el)
                .fontSize
                .slice(0, -2)
        )
    }

    onResize(dimension: {width: number, height: number}) {
        this.clientWidth = dimension.width
    }
    mounted() {
        this.clientWidth = this.$el.clientWidth
    }


}

</script>

<style lang="scss" scoped>
@import '~@/assets/css/overwatch-ui.scss';

.comment-section {
    max-width: 100%;

    .comment-form {
        justify-content: flex-end;

        button.close-button {
            order: 0;
        }
    }

    .first-comments-level {
        margin-left: -1em;
    }
}
</style>
