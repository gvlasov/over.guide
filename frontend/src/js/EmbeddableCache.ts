const unembeddable = {} as any;
export default {
    isEmbeddable(videoId: string) {
        return typeof unembeddable[videoId] === 'undefined';
    },
    saveIsNotEmbeddable(videoId: string) {
        return unembeddable[videoId] = true;
    }
}

