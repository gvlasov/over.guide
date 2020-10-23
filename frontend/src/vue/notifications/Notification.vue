<template>
    <div
            class="notification"
            v-bind:class="{unread: !notification.read}"
    >
        <CommentNotificationContent
                v-if="isCommentNotification"
                :notification="notification"
        />
        <SentenceNotificationContent
                v-else-if="isSentenceNotification"
                :notification="notification"
        />
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import NotificationReadDto from "data/dto/NotificationReadDto";
import {Prop} from "vue-property-decorator";
import CommentNotificationContent from "./CommentNotificationContent.vue";
import NotificationTypeId from "data/NotificationTypeId";
import SentenceNotificationContent from "./SentenceNotificationContent.vue";

@Component({
    components: {
        SentenceNotificationContent,
        CommentNotificationContent,
    },
})
export default class Notification extends Vue {


    @Prop({required: true})
    notification: NotificationReadDto

    get isCommentNotification(): boolean {
        return this.notification.notificationTypeId === NotificationTypeId.CommentReply ||
            this.notification.notificationTypeId === NotificationTypeId.GuideReply
    }

    get isSentenceNotification(): boolean {
        return this.notification.notificationTypeId === NotificationTypeId.SentenceCreated ||
            this.notification.notificationTypeId === NotificationTypeId.SentenceUpdated
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
    justify-content: stretch;
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
}
</style>
