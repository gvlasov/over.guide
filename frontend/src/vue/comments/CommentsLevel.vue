<template>
    <div class="comment-level">
        <div
                v-for="comment in displayComments"
                class="comment-chain-node"
        >
            <div class="aside">
                <Upvoter
                        v-bind:style="{visibility: comment.deleted ? 'hidden' : 'visible'}"
                        :post-id="comment.id"
                        :post-type-id="PostTypeId.Comment"
                        :initial-upvoted="false"
                        @upvote="() => comment.votesCount++"
                        @upvoteRemoved="() => comment.votesCount--"
                />
                <CommentHider
                        v-if="comment.children.length > 0 && level < lastNestingLevel"
                        v-hammer:tap="() => toggleCommentTree(comment)"
                />
            </div>
            <div class="comment-branch">
                <Comment
                        :comment="comment"
                        :post="post"
                        :enable-hash-anchor="enableHashAnchor"
                />
                <HiddenCommentsDropdown
                        v-if="followingHidden(comment)"
                        :comments="comment.children"
                        v-hammer:tap="() => revealCommentTree(comment)"
                />
                <CommentsLevel
                        v-else-if="comment.children.length > 0 && level < lastNestingLevel"
                        :comments="comment.children"
                        :parent="comment"
                        :post="post"
                        :level="level + 1"
                        :last-nesting-level="lastNestingLevel"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {Prop} from "vue-property-decorator";
import Component from "vue-class-component";
import CommentVso from "@/ts/vso/CommentVso";
import Comment from "@/vue/comments/Comment.vue";
import CommentsSection from "@/vue/comments/CommentsSection.vue";
import PostVso from "@/ts/vso/PostVso";
import CommentHider from "@/vue/comments/CommentHider.vue";
import Upvoter from "@/vue/comments/Upvoter.vue";
import HiddenCommentsDropdown from "@/vue/comments/HiddenCommentsDropdown.vue";
import PostTypeId from "data/PostTypeId";

@Component({
    components: {
        HiddenCommentsDropdown,
        Upvoter,
        CommentsSection,
        Comment,
        CommentsLevel,
        CommentHider,
    }
})
export default class CommentsLevel extends Vue {

    PostTypeId = PostTypeId

    @Prop({required: true})
    comments: CommentVso[]

    @Prop({required: true})
    parent: CommentVso | PostVso

    @Prop({required: true})
    post: PostVso

    @Prop({required: true})
    level: number

    @Prop({default: true})
    enableHashAnchor: boolean

    @Prop({default: 1})
    lastNestingLevel: number

    followingHiddens: {
        [key: number]: boolean
    } = {}

    followingHidden(comment: CommentVso): boolean {
        return this.followingHiddens[comment.id]
    }

    toggleCommentTree(comment: CommentVso) {
        this.followingHiddens[comment.id] = !this.followingHiddens[comment.id]
        this.$forceUpdate()
    }

    revealCommentTree(comment: CommentVso) {
        this.followingHiddens[comment.id] = false
        this.$forceUpdate()
    }

    get displayComments(): CommentVso[] {
        if (this.level >= this.lastNestingLevel) {
            return this.comments
                .flatMap(c => [c, ...c.recursiveChildren])
                .sort((a, b) => {
                    return a.createdAt.getTime() - b.createdAt.getTime()
                })
        } else {
            return this.comments
        }
    }
}

</script>

<style lang="scss" scoped>
@import "~@/assets/css/tags.scss";

.comment-level {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    gap: 1.5em;
    padding-left: 1em;

    .aside {
        box-sizing: border-box;
        padding-top: .5em;
        min-height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1em;
        .upvoter {
            font-size: .7em;
        }
    }

    .comment-chain-node {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: .5em;

        .comment-branch {
            display: flex;
            flex-direction: column;
            flex-grow: 0;
            flex-wrap: nowrap;
            gap: 1.5em;

            .hidden-comments-dropdown {
                width: 12em;
                margin: .2em;
            }
        }
    }
}
</style>
