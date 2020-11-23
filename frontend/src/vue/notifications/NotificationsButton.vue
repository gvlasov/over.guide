<template>
    <div
            class="bell-button"
    >
        <div class="bell-button-content-wrap">
            <font-awesome-icon icon="bell"/>
            <div
                    v-if="unreadNotificationsCount > 0"
                    class="counter"
            >{{ unreadNotificationsCount }}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from "vue-class-component";
import NotificationReadDto from "data/dto/NotificationReadDto";
import {Prop} from "vue-property-decorator";

@Component({
    components: {
    },
})
export default class NotificationsSection extends Vue {

    @Prop({required: true})
    notifications: NotificationReadDto[] | null

    get unreadNotificationsCount(): number {
        if (this.notifications === null) {
            return 0
        }
        return this.notifications.filter(n => !n.read).length
    }

};

</script>

<style lang="scss" scoped>
@import '~@/assets/css/common.scss';

.bell-button {
    font-size: 1em;
    user-select: none;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .bell-button-content-wrap {
        position: relative;
        top: .1em;

        .counter {
            background-color: hsl(16, 80%, 50%);
            border-radius: 50%;
            position: absolute;
            top: 0;
            left: 50%;
            width: 1em;
            height: 1em;
            line-height: .9em;
            padding: .2em;
            font-size: .5em;
        }
    }

}
</style>
