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
    font-variant-caps: normal;
    border-bottom: 1px solid hsl(227, 15%, 60%);
    background-color: hsla(227, 16%, 48%, 0.98);
    position: relative;
    box-sizing: border-box;

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
