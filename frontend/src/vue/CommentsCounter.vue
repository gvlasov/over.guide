<template>
    <span class="remark42__counter" v-bind:data-url="url"></span>
</template>

<script>
    import Topic from "../js/Topic";
    import env from '@/env/dev'

    let remarkScriptsLoading = false;
    export default {
        props: {
            topic: Topic
        },
        computed: {
            url() {
                return this.topic.id
            }
        },
        data() {
            return {};
        },
        methods: {
            elementId() {
                return 'remark42-counter-' + this.topic.id
            }
        },
        mounted() {
            if (typeof window.remark_config === 'undefined') {
                window.remark_config = {
                    host: env.REMARK_BASE_URL,
                    site_id: env.REMARK_SITE_ID,
                };
            }
            if (!remarkScriptsLoading) {
                remarkScriptsLoading = true;
                (function (c) {
                    for (var i = 0; i < c.length; i++) {
                        var d = document, s = d.createElement('script');
                        s.src = env.REMARK_BASE_URL + '/web/' + c[i] + '.js';
                        s.defer = true;
                        (d.head || d.body).appendChild(s);
                    }
                })(['counter']);
            }
        },
        components: {},
    };

</script>

<style scoped>
</style>
