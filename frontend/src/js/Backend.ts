import Alternative from "data/dto/Alternative";
import PickSuggestion from "./PickSuggestion";
import MatchupEvaluation from "data/dto/MatchupEvaluation";
import {AxiosResponse, AxiosStatic, Method} from "axios";
import PickContext from "./PickContext";
import Hero from "data/dto/Hero"
import YoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerpt";

export default class Backend {
    private axios: AxiosStatic;
    private rootUrl: string;

    constructor(axios: AxiosStatic, rootUrl: string) {
        this.axios = axios;
        this.rootUrl = rootUrl;
    }

    protected async query<R>(
        method: Method,
        url: string,
        inDto: object,
        onResponse: (response: AxiosResponse) => R
    ): Promise<R> {
        return await this.axios.request({
            url: this.rootUrl + url,
            data: inDto,
            method: method
        })
            .then(onResponse);
    }

    async suggestPick(context: PickContext): Promise<PickSuggestion> {
        return this.query(
            'POST',
            '/suggest-pick',
            context.forRequest(),
            response => {
                return new PickSuggestion(
                    response.data.map(
                        (data: object) => data as Alternative
                    )
                );
            }
        )
    }

    async evaluateMatchup(subject: Hero, object: Hero): Promise<MatchupEvaluation> {
        return this.query(
            'POST',
            '/matchup-evaluation',
            {
                subject: subject.dataName,
                object: object.dataName
            },
            response => response.data as MatchupEvaluation
        )
    };

    async saveVideoExcerpt(excerpt: YoutubeVideoExcerpt): Promise<number | null> {
        return this.query(
            'PUT',
            '/youtube-video-excerpt',
            excerpt,
            (response) => {
                console.log(response);
                if (response.status === 201) {
                    return response.data.id;
                } else {
                    return null;
                }
            }
        )
    };
}

