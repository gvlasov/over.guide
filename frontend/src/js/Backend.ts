import Alternative from "data/dto/Alternative";
import PickSuggestion from "./PickSuggestion";
import MatchupEvaluation from "data/dto/MatchupEvaluation";
import {AxiosResponse, AxiosStatic, Method} from "axios";
import PickContext from "./PickContext";
import Hero from "data/dto/Hero"
import YoutubeVideoExcerpt from "data/dto/YoutubeVideoExcerpt";
import env from '../env/dev'
import Cookies from 'js-cookie'

export default class Backend {
    private readonly axios: AxiosStatic;
    private readonly rootUrl: string;

    constructor(axios: AxiosStatic) {
        this.axios = axios;
        this.rootUrl = window.location.protocol
            + "//"
            + (window.location.hostname === env.DOCKER_FRONTEND_HOST ? env.DOCKER_BACKEND_HOST : window.location.hostname)
            + ":"
            + env.BACKEND_PORT;
        console.log(this.rootUrl)
    }

    protected async query<R>(
        method: Method,
        url: string,
        inDto: object,
        onResponse: (response: AxiosResponse) => R
    ): Promise<R> {
        const authToken = Cookies.get('auth-token');
        let headers = (typeof authToken === 'undefined')
            ? {}
            : {'Authorization': 'Bearer ' + authToken};
        return await this.axios.request({
            url: this.rootUrl + url,
            data: inDto,
            method: method,
            headers: headers
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

    async getMatchupScore(subject: Hero, object: Hero): Promise<MatchupEvaluation> {
        return this.query(
            'GET',
            '/matchup-evaluation',
            {
                subject: subject.dataName,
                object: object.dataName
            },
            response => response.data as MatchupEvaluation
        )
    };

    async evaluateMatchup(subject: Hero, object: Hero, score: number): Promise<MatchupEvaluation> {
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

