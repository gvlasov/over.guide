<template>
    <div class="sentence-notification-content">
        <div>Your actions on this site required moderator attention. Now</div>
        <ul>
            <li
                    v-for="restriction in notification.json.restrictions"
            >
                {{ renderRestrictionText(restriction) }}
            </li>
            <li
                    v-for="immediateAction in notification.json.immediateActions"
            >
                {{ restrictionTypes.get(immediateAction.typeId).defenderLabel }}
            </li>
        </ul>
        <template v-if="notification.json.judgeCommentary !== null">
            <div>Moderator commented:</div>
            <div>{{ notification.json.judgeCommentary }}</div>
        </template>
        <div>
            See your current
            <router-link :to="'/user/'+auth.userId+'#restrictions'">restrictions</router-link>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import NotificationReadDto from "data/dto/NotificationReadDto";
import {Prop} from "vue-property-decorator";
import RelativeTime from "@/vue/guides/RelativeTime.vue";
import UserLink from "@/vue/guides/UserLink.vue";
import restrictionTypes from "data/restrictionTypes";
import RestrictionReadDto from "data/dto/RestrictionReadDto";
import PostTypeId from "data/PostTypeId";
import Authentication from "../../ts/Authentication";

@Component({
    components: {
        UserLink,
        RelativeTime,
    },
})
export default class CommentNotificationContent extends Vue {

    auth = Authentication.instance

    restrictionTypes = restrictionTypes

    @Prop({required: true})
    notification: NotificationReadDto

    renderRestrictionText(restriction: RestrictionReadDto): string {
        const restrictionTypeDto = this.restrictionTypes.get(restriction.typeId);
        let url: string
        if (restrictionTypeDto.postTypeRestriction) {
            if (
                restrictionTypeDto.postTypeRestriction.includes(
                    PostTypeId.Guide
                )
            ) {
                url = `/guide/${restriction.objectId}`
            } else if (
                restrictionTypeDto.postTypeRestriction.includes(
                    PostTypeId.Comment
                )
            ) {
                url = `/guide/${restriction.objectId}`
            } else {
                throw new Error('Unknown post types ' + JSON.stringify(restrictionTypeDto.postTypeRestriction))
            }
        }
        return restrictionTypeDto.defenderLabel.replace(
            /%s/,
            url
        )
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';

.sentence-notification-content {
    padding: 1em .5em 1em 1.5em;
    font-family: 'IBM Plex Sans', 'sans-serif';
    color: white;
}
</style>
