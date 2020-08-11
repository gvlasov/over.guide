<template>
    <div v-bind:id="elementId()"></div>
</template>

<script>
    import Topic from "../js/Topic";
    import env from '@/env/dev'

    let remarkScriptsLoaded = false;
    let remarkScriptsLoading = false;
    export default {
        props: {
            topic: Topic
        },
        computed: {},
        data() {
            return {
                config: {
                    host: env.REMARK_BASE_URL,
                    site_id: env.REMARK_SITE_ID,
                    url: this.topic.id,
                    components: ['embed'],
                    max_shown_comments: 15,
                    theme: 'dark',
                    page_title: this.topic.id,
                    locale: 'en',
                    node: this.elementId(),
                }
            };
        },
        methods: {
            initRemark42() {
                window.REMARK42.createInstance(this.config);
            },
            elementId() {
                return 'remark42-comments-' + this.topic.id
            }
        },
        mounted() {
            if (remarkScriptsLoaded) {
                this.initRemark42()
            } else {
                window.addEventListener('REMARK42::ready', () => {
                    remarkScriptsLoaded = true;
                    this.initRemark42()
                });
                if (!remarkScriptsLoading) {
                    remarkScriptsLoading = true;
                    (function (c) {
                        for (var i = 0; i < c.length; i++) {
                            var d = document, s = d.createElement('script');
                            s.src = env.REMARK_BASE_URL + '/web/' + c[i] + '.js';
                            s.defer = true;
                            (d.head || d.body).appendChild(s);
                        }
                    })(['embed']);
                }
            }
        },
        components: {},
    };

</script>

<style scoped>
</style>
