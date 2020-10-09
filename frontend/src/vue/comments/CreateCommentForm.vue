<template>
    <CommentForm
            :close-button-text="closeButtonText"
            @submit="sendReply"
            :submit-button-text="'Reply'"
            @cancel="$emit('cancel')"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";
import PostVso from "@/ts/vso/PostVso";
import Backend from "@/ts/Backend";
import CommentCreateDto from "data/dto/CommentCreateDto";
import CommentVso from "@/ts/vso/CommentVso";
import CommentForm from "./CommentForm.vue";

@Component({
    components: {
        CommentForm,
    }
})
export default class CreateCommentForm extends Vue {

    @Ref('textarea') textarea: HTMLTextAreaElement

    @Prop({required: true})
    post: PostVso

    @Prop({required: true})
    parent: CommentVso | PostVso

    @Prop({required: true})
    commentsLevel: CommentVso[]

    @Prop({default: 'cancel'})
    closeButtonText: string

    sendReply(message) {
        this.$emit('reply')
        Backend.instance
            .createComment({
                postType: this.post.postType,
                postId: this.post.postId,
                parentId: this.parent instanceof CommentVso ? this.parent.id : null,
                content: message,
            } as CommentCreateDto)
            .then((dto) => {
                this.post.commentsCount++;
                return this.commentsLevel.unshift(new CommentVso(dto, []))
            })
    }

}

</script>

<style lang="scss" scoped>
</style>
