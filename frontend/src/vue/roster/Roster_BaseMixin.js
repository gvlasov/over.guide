import heroes from "data/heroes";

export default {
    props: {
        heroes: {
            type: Array,
            default: () => Array.from(heroes.values()),
        },
    },
};
