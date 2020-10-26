<template>
    <div
            class="comment"
            v-bind:class="{deleted: comment.deleted, 'linked-to': enableHashAnchor && linkedTo}"
    >
        <a v-if="enableHashAnchor" v-bind:id="anchorHash"></a>
        <div class="heading">
            <UserLink
                    :user="comment.author"
                    v-bind:class="{'op-username': !isOpPost}"
            />
            <template
                    v-if="comment.votesCount !== void 0"
            >
                <div
                        class="points"
                >{{ comment.votesCount }} points
                </div>
                <div class="separator">·</div>
            </template>
            <RelativeTime class="time" :time="comment.updatedAt"/>
        </div>
        <div
                v-if="!comment.deleted"
                class="content"
        >
            {{ comment.content }}
        </div>
        <div v-else class="deleted-comment">
            Deleted
        </div>
        <div class="buttons">
            <LinkLikeButton
                    v-if="!comment.deleted && auth.loggedIn"
                    class="reply-button"
                    v-hammer:tap="() => showReplyForm = !showReplyForm"
            >Reply
            </LinkLikeButton>
            <LinkLikeButton
                    v-if="!comment.deleted && comment.author.id === auth.userId"
                    v-hammer:tap="() => showEditForm = !showEditForm"
            >Edit
            </LinkLikeButton>
            <LinkLikeButton
                    v-if="!comment.deleted && comment.author.id === auth.userId"
                    v-hammer:tap="() => showDeleteDialogue = !showDeleteDialogue"
            >Delete
            </LinkLikeButton>
            <NotificationModalPopup
                    v-if="showDeleteDialogue"
                    @close="() => showDeleteDialogue = false"
            >
                <div class="deletion-dialogue">
                    <p>
                        Are you sure you want to delete this comment?<br/>This can't be undone.
                    </p>
                    <OverwatchButton
                            type="default"
                            v-hammer:tap="() => showDeleteDialogue = false"
                    >Back
                    </OverwatchButton>
                    <OverwatchButton
                            type="main"
                            v-hammer:tap="deleteComment"
                    >Delete
                    </OverwatchButton>
                </div>
            </NotificationModalPopup>
            <LinkLikeButton
                    v-if="!comment.deleted && comment.author.id === auth.userId"
                    v-hammer:tap="() => showReportDialogue = !showReportDialogue"
            >Report
            </LinkLikeButton>
            <NotificationModalPopup
                    v-if="showReportDialogue"
                    @close="() => showReportDialogue = false"
            >
                <ReportCreator
                        :post-type-id="PostTypeId.Comment"
                        :post-id="comment.id"
                        post-type-name="comment"
                        :reasons="commentReportReasons"
                        @close="() => showReportDialogue = false"
                />
            </NotificationModalPopup>
        </div>
        <div
                v-if="showReplyForm || showEditForm"
                class="form-wrap"
        >
            <CreateCommentForm
                    v-if="showReplyForm"
                    :post="post"
                    :parent="comment"
                    :comments-level="comment.children"
                    @reply="() => showReplyForm = !showReplyForm"
                    @cancel="() => showReplyForm = false"
            />
            <EditCommentForm
                    v-else-if="showEditForm"
                    :comment="comment"
                    @edit="() => showEditForm = !showEditForm"
                    @cancel="() => showEditForm = false"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import CommentVso from "@/ts/vso/CommentVso";
import OverwatchButton from "@/vue/OverwatchButton.vue";
import CommentForm from "@/vue/comments/CommentForm.vue";
import PostVso from "@/ts/vso/PostVso";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import Authentication from "@/ts/Authentication";
import CommentHider from "@/vue/comments/CommentHider.vue";
import ReportCreator from "@/vue/guides/ReportCreator.vue";
import PostTypeId from "data/PostTypeId";
import reportReasons from 'data/reportReasons'
import ReportReasonId from "data/ReportReasonId";
import Backend from "@/ts/Backend";
import CreateCommentForm from "@/vue/comments/CreateCommentForm.vue";
import EditCommentForm from "@/vue/comments/EditCommentForm.vue";
import {Route} from "vue-router";
import NotificationModalPopup from "@/vue/general/NotificationModalPopup.vue";
import LinkLikeButton from "@/vue/general/LinkLikeButton.vue";

const commentReportReasons = [
    reportReasons.get(ReportReasonId.Spam),
    reportReasons.get(ReportReasonId.OffensiveLanguage),
]

@Component({
    components: {
        LinkLikeButton,
        NotificationModalPopup,
        EditCommentForm,
        CreateCommentForm,
        ReportCreator,
        CommentHider,
        UserLink,
        RelativeTime,
        CommentForm,
        OverwatchButton,
    }
})
export default class Comment extends Vue {
    PostTypeId = PostTypeId

    commentReportReasons = commentReportReasons

    @Prop({required: true})
    comment: CommentVso

    @Prop({default: true})
    enableHashAnchor: boolean

    @Prop({required: true})
    post: PostVso

    @Prop({default: false})
    initialShowReplyForm: boolean

    showReportDialogue: boolean = false

    showDeleteDialogue: boolean = false

    linkedTo: boolean = false

    auth: Authentication = Authentication.instance

    showReplyForm = this.initialShowReplyForm

    showEditForm = false

    declare $route: Route

    get isOpPost(): boolean {
        return this.post.authorId !== this.comment.author.id
    }

    deleteComment() {
        Backend.instance.deleteComment(
            this.comment.id,
        )
            .finally(() => {
                this.showDeleteDialogue = false
                this.comment.deleted = true;
                this.$emit('deleted')
            })
    }

    get anchorHash(): string {
        return `comment-${this.comment.postType}-${this.comment.postId}-${this.comment.id}`;
    }

    mounted() {
        if (this.enableHashAnchor && this.$route.hash === '#' + this.anchorHash) {
            this.$scrollTo(this.$el, 300)
            this.linkedTo = true
        }
    }

}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/overwatch-ui.scss";

$weak-color: #d2d2d2;
$strong-color: white;
.comment {
    color: $weak-color;
    text-align: left;
    display: flex;
    flex-direction: column;
    gap: .6em;
    max-width: 100%;
    font-family: "IBM Plex Sans", 'sans-serif';

    .heading {
        width: 100%;

        & > * {
            display: inline-block;
        }
    }

    .content {
        display: block;
        font-size: 1.1em;
        color: $strong-color;
        word-wrap: break-word;
    }

    form {
        display: block;
        resize: vertical;

        & ::v-deep textarea {
            margin-bottom: .5em;
        }

        & ::v-deep button {
            margin-right: .2em;
        }
    }

    .buttons > button {
        img {
            margin-right: .3em;
        }
    }

    .reply-button img {
        height: .7em;
        vertical-align: middle;
        margin-bottom: .1em;
    }

    .time {
        font-size: .8em;
    }

    .separator {
        font-size: .8em;
    }

    .points {
        font-size: .8em;
    }

    .user-link {
        margin-right: .5em;
        font-size: 1em;
        @include overwatch-futura;
        color: #e9e9e9;

        &.op-username {
            text-shadow: .05em .05em 0 black;
            font-weight: bold;
        }
    }

    .form-wrap {
        display: block;

        .hider {
            flex-grow: 0;
            margin-left: 2em;
        }
    }


    &.deleted {
        background-color: hsla(0, 66%, 41%, .3);
    }

    &.linked-to {
        background-color: hsla(348, 83%, 47%, .3);
        padding: 0 1em 1em 1em;
    }
}

.deletion-dialogue {
    padding: 1em;
    background-color: hsla(0, 0%, 20%, .95);
    @include overwatch-futura-no-smallcaps;
}

</style>
