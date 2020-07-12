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
        <div
                class="approve-button overwatch-main-button"
                v-hammer:tap="approveRoles"
                v-bind:class="{disabled: !canApprove}"
        >READY
        </div>
    </div>
</template>

<script>
    import RoleCheckbox from "./RoleCheckbox.vue";
    import Role from "data/Role";

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
        components: {RoleCheckbox},
    };

</script>

<style scoped>
    @import '../assets/css/fonts.css';
    @import '../assets/css/overwatch-ui.css';

    .approve-button {
    }

    .checkboxes-wrap {
        margin-bottom: 2vw;
        margin-top: 1vw;
    }
</style>
