import DescriptorParamUnparser from "@/js/DescriptorParamUnparser";

export default {
    methods: {
        searchTag() {
            const newPath = "/search/"
                + new DescriptorParamUnparser().unparseDescriptor(this.guide.descriptor);
            this.$router.push(newPath)
        }
    },
};
