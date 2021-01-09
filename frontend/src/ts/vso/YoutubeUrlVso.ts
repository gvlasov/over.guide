export default class YoutubeUrlVso {

    private static GOOGLE_API_KEY = 'AIzaSyAQO9TNzTy3xcj0L4Ic2pGQjP1a_vjAX50'

    constructor(public url: URL) {
        if (!this.isValidUrl) {
            throw new TypeError(
                this.url.href + ' is not a valid Youtube URL'
            )
        }
    }

    private get isValidUrl(): boolean {
        return this.isValidShortUrl || this.isValidLongUrl
    }

    private get isValidLongUrl(): boolean {
        return !!this.url.hostname.match(/youtube\.com$/) &&
            !!this.url.search.match(/v=([^&]+)(&|$)/);
    }

    private get isValidShortUrl(): boolean {
        return !!this.url.hostname.match(/youtu\.be$/) &&
            this.url.pathname.substr(1).length > 8
    }

    get videoId(): string {
        if (this.isValidShortUrl) {
            return this.url.pathname.substr(1)
        } else {
            const longUrlMatch = this.url.search.match(/v=([^&]+)(&|$)/);
            if (longUrlMatch === null) {
                throw new TypeError(
                    this.url.href + ' is not a valid Youtube URL'
                )
            } else {
                return longUrlMatch[1]
            }
        }
    }

    get timestampSeconds(): number | null {
        const match = this.url.search.match(/t=([^&]+)(&|$)/);
        if (match === null) {
            return null
        }
        return Number.parseInt(match[1]);
    }

    async apiJson(): Promise<any> {
        return await fetch(
            "https://www.googleapis.com/youtube/v3/videos?id=" + this.videoId + "&key=" + YoutubeUrlVso.GOOGLE_API_KEY + "&part=contentDetails",
            {}
        ).then(
            response =>
                response.json()
        )
    }

    private parseISO8601DurationToSeconds(iso8601Duration: string): number {
        var iso8601DurationRegex = /(-)?P(?:([.,\d]+)Y)?(?:([.,\d]+)M)?(?:([.,\d]+)W)?(?:([.,\d]+)D)?T(?:([.,\d]+)H)?(?:([.,\d]+)M)?(?:([.,\d]+)S)?/;
        var matches = iso8601Duration.match(iso8601DurationRegex);
        if (matches === null) {
            throw new Error('No matches')
        }
        let days = matches[5] === undefined ? 0 : Number.parseInt(matches[5]);
        let hours = matches[6] === undefined ? 0 : Number.parseInt(matches[6]);
        let minutes = matches[7] === undefined ? 0 : Number.parseInt(matches[7]);
        let seconds = matches[8] === undefined ? 0 : Number.parseInt(matches[8]);
        return seconds + minutes * 60 + hours * 3600 + days * 86400;
    };

}
