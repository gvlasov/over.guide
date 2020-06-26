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
                class="approve-button"
                v-hammer:tap="approveRoles"
                v-bind:class="{disabled: !canApprove}"
        >READY
        </div>
    </div>
</template>

<script>
    import RoleCheckbox from "./RoleCheckbox.vue";

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
                availableRoles: ['Tank', 'Damage', 'Support'],
                roles: []
            }
        },
        components: {RoleCheckbox},
    };

</script>

<style scoped>
    @import '../assets/css/fonts.css';

    .approve-button {
        background-color: orange;
        color: white;
        font-family: 'Futura Demi Bold', sans-serif;
        font-size: 2.5vw;
        font-variant-caps: all-small-caps;
        line-height: 1.9vw;
        border: 0;
        font-weight: bold;
        padding: .4vw 2.7vw .8vw 2.7vw;
        display: inline-block;
        letter-spacing: 0.03em;
        border-radius: .13vw;
        opacity: .88;
        cursor: pointer;
        user-select: none;
    }

    .checkboxes-wrap {
        margin-bottom: 2vw;
        margin-top: 1vw;
    }
</style>
