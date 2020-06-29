import Alternative from "data/dto/Alternative";
import PickSuggestion from "./PickSuggestion";
import MatchupEvaluation from "data/dto/MatchupEvaluation";
import {AxiosStatic} from "axios";
import PickContext from "./PickContext";
import Hero from "data/dto/Hero"

export default class Backend {
    private axios: AxiosStatic;
    private rootUrl: string;

    constructor(axios: AxiosStatic, rootUrl: string) {
        this.axios = axios;
        this.rootUrl = rootUrl;
    }

    async suggestPick(context: PickContext): Promise<PickSuggestion> {
        return await this.axios.post(this.rootUrl + '/suggest-pick', context.forRequest(), {})
            .then(response => {
                    return new PickSuggestion(
                        response.data.alternatives.map(
                            (data: object) => data as Alternative
                        )
                    );
                }
            );
    }

    async evaluateMatchup(subject: Hero, object: Hero): Promise<MatchupEvaluation> {
        return await this.axios.post(
            this.rootUrl + '/matchup-evaluation',
            {
                subject: subject.dataName,
                object: object.dataName
            },
            {}
        )
            .then(response => response.data as MatchupEvaluation);
    };

    async saveVideoExcerpt(videoId: string, startSeconds: number, endSeconds: number): Promise<number | null> {
        return await this.axios.post(
            this.rootUrl + '/youtube-video-excerpt',
            {
                videoId: videoId,
                startSeconds: startSeconds,
                endSeconds: endSeconds,
            },
            {}
        )
            .then((response) => {
                if (response.status === 201) {
                    return response.data.id;
                } else {
                    return null;
                }
            });
    };
}

