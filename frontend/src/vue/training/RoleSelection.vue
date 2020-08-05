<template>
    <div>
        <div class="checkboxes-wrap">
            <RoleCheckbox
                    v-for="role in availableRoles"
                    v-bind:key="role"
                    :value="role"
                    v-model="roles"
            />
        </div>
        <OverwatchButton
                :type="'main'"
                v-hammer:tap="approveRoles"
                v-bind:disabled="!canApprove"
                class="ready-button"
        >READY
        </OverwatchButton>
    </div>
</template>

<script>
    import RoleCheckbox from "@/vue/training/RoleCheckbox.vue";
    import Role from "data/Role";
    import OverwatchButton from "@/vue/OverwatchButton";

    export default {
        props: {},
        methods: {
            approveRoles() {
                this.$emit('rolesApproved', this.roles)
            }
        },
        computed: {
            canApprove() {
                return this.roles.length > 0;
            },
        },
        data() {
            return {
                availableRoles: [Role.Tank, Role.Damage, Role.Support],
                roles: []
            }
        },
        components: {OverwatchButton, RoleCheckbox},
    };

</script>

<style lang="scss" scoped>
    @import '~@/assets/css/fonts.css';
    @import '~@/assets/css/overwatch-ui.scss';

    .checkboxes-wrap {
        margin-bottom: 2vw;
        margin-top: 1vw;
    }

    .ready-button {
        font-size: 3em;
    }
</style>
