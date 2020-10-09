<template>
    <CommentForm
            :close-button-text="closeButtonText"
            :submit-button-text="'Edit'"
            @submit="sendEdit"
            @cancel="$emit('cancel')"
            :error-message="errorMessage"
    />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import {Prop, Ref} from "vue-property-decorator";
import Backend from "@/ts/Backend";
import CommentVso from "@/ts/vso/CommentVso";
import Authentication from "@/ts/Authentication";
import CommentForm from "./CommentForm.vue";

@Component({
    components: {
        CommentForm,
    }
})
export default class EditCommentForm extends Vue {

    @Ref('textarea') textarea: HTMLTextAreaElement

    @Prop({required: true})
    comment: CommentVso

    @Prop({default: 'cancel'})
    closeButtonText: string

    auth: Authentication = Authentication.instance

    errorMessage: string|null = null

    sendEdit(message) {
        Backend.instance
            .editComment(
                this.comment.id,
                message
            )
            .then((dto) => {
                this.comment.content = message;
                this.$emit('edit')
            })
            .catch(e => {
                if (e.response.status === 422) {
                    this.errorMessage = 'You can only edit comments in first 30 minutes'
                }
            })
    }

}

</script>

<style lang="scss" scoped>
</style>
