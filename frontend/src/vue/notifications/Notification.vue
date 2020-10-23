<template>
    <div
            class="notification"
            v-bind:class="{unread: !notification.read}"
    >
        <router-link
                :key="notification.id"
                :to="{path: `/guide/${notification.json.postId}`, hash: commentElementHash}"
                v-scroll-to="scrollConfig"
                class="overlay-link"
        >
        </router-link>
        <CommentsLevel
                :post="post"
                :comments="[comment]"
                :last-nesting-level="1"
                :parent="null"
                :level="1"
                :enable-hash-anchor="false"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import NotificationReadDto from "data/dto/NotificationReadDto";
import {Prop} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import Comment from "@/vue/comments/Comment.vue";
import CommentVso from "@/ts/vso/CommentVso";
import {CommentReadDto} from "data/dto/CommentReadDto";
import PostVso from "../../ts/vso/PostVso";
import CommentsLevel from "../comments/CommentsLevel.vue";

@Component({
    components: {
        CommentsLevel,
        Comment,
        UserLink,
        RelativeTime,
    },
})
export default class Notification extends Vue {

    @Prop({required: true})
    notification: NotificationReadDto

    get commentElementHash(): string {
        return `#comment-${this.notification.json.postType}-${this.notification.json.postId}-${this.notification.json.id}`
    }

    get comment(): CommentVso {
        return new CommentVso(this.notification.json as CommentReadDto, [])
    }

    get scrollConfig() {
        return {
            el: this.commentElementHash,
            onDone: () => {
                this.$emit('navigatedToComment')
            },
            duration: 150,
        }
    }

    get post(): PostVso {
        return {
            commentsCount: 0,
            authorId: 0,
            postId: this.notification.json.postId,
            postType: this.notification.json.postType,
        }
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';

.notification {
    text-decoration: none;
    color: white;
    font-family: "IBM Plex Sans", 'sans-serif';
    font-variant-caps: normal;
    padding: 1em .5em 1em .5em;
    border-bottom: 1px solid hsl(227, 15%, 60%);
    background-color: hsla(227, 16%, 48%, 0.98);
    display: flex;
    flex-direction: row;
    align-items: start;
    flex-wrap: nowrap;
    justify-content: center;
    gap: .5em;
    position: relative;

    &:hover {
        background-color: hsla(227, 22%, 43%, 0.98);
    }

    &.unread {
        background-color: hsl(340, 16%, 48%, .98);
        &:hover {
            background-color: hsl(340, 22%, 43%, .98);
        }
    }

    .overlay-link {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 1;

    }

    .comment-level {
        flex-grow: 1;
        z-index: 2;
        pointer-events: none;

        & ::v-deep a,
        & ::v-deep button,
        & ::v-deep textarea,
        & ::v-deep input,
        {
            pointer-events: auto;
        }
    }

    .permalink {
        font-size: 1.5em;
        color: white;
        flex-grow: 0;
        padding: 1em;
        background-color: hsla(227, 16%, 48%, 0.98);
        border-radius: .3em;

        &:hover {
            background-color: hsla(208, 50%, 50%, 0.98);
        }
    }
}
</style>
