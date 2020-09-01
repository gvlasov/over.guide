import AlternativeDto from "data/dto/AlternativeDto";
import PickSuggestion from "./PickSuggestion";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import {AxiosResponse, AxiosStatic, Method} from "axios";
import PickContext from "./PickContext";
import HeroDto from "data/dto/HeroDto"
import YoutubeVideoExcerpsDto from "data/dto/YoutubeVideoExcerpsDto";
import env from '../env/dev'
import GuideHistoryEntryDto from "data/dto/GuideHistoryEntryDto";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import TrainingGoalDto from "data/dto/TrainingGoalDto";
import UserInfoDto from "data/dto/UserInfoDto";
import UsernameOccupiedException from "@/js/UsernameOccupiedException";
import Authentication from "@/js/Authentication";

const querystring = require('query-string')

const auth = new Authentication()
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
    }

    protected async query<R>(
        method: Method,
        url: string,
        inDto: object,
        onResponse: (response: AxiosResponse) => R
    ): Promise<R> {
        const authToken = auth.authToken
        let headers = (typeof authToken === 'undefined')
            ? {}
            : {'Authorization': 'Bearer ' + authToken};
        return await this.axios.request({
            url: this.rootUrl + url,
            ...(method === 'GET' ? {
                params: inDto,
                paramsSerializer: (params) => {
                    return querystring.stringify(params, {
                        arrayFormat: 'separator',
                        arrayFormatSeparator: ','
                    })
                }
            } : {
                data: inDto
            }),
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
                        (data: object) => data as AlternativeDto
                    )
                );
            }
        )
    }

    async getMatchupScore(subject: HeroDto, object: HeroDto): Promise<MatchupEvaluationDto> {
        return this.query(
            'GET',
            '/matchup-evaluation',
            {
                subject: subject.id,
                object: object.id,
            },
            response => response.data as MatchupEvaluationDto
        )
    };

    async getMyTrainingGoals(): Promise<TrainingGoalDto[]> {
        return this.query(
            'GET',
            '/my-training-goals',
            {},
            response => response.data as TrainingGoalDto[]
        )
    };

    async addTrainingGoal(guideId: number, order?: number): Promise<GuideHistoryEntryDto[]> {
        return this.query(
            'POST',
            '/my-training-goals/' + guideId,
            {
                order
            },
            response => response.data
        )
    }

    async removeTrainingGoal(guideId: number): Promise<GuideHistoryEntryDto[]> {
        return this.query(
            'DELETE',
            '/my-training-goals/' + guideId,
            {},
            response => response.data
        )
    }

    async reorderTrainingGoals(guideIds: number[]): Promise<void> {
        return this.query(
            'POST',
            '/my-training-goals/reorder',
            guideIds,
            response => {
            }
        )
    }

    async addAndReorderTrainingGoals(
        newGoalId: number,
        newGoalsOrder: number[]
    ): Promise<void> {
        return this.query(
            'POST',
            '/my-training-goals/add-and-reorder',
            {
                newGoalId: newGoalId,
                newGoalsOrder: newGoalsOrder,
            },
            response => {
            }
        )
    }

    async evaluateMatchup(subject: HeroDto, object: HeroDto, score: number): Promise<MatchupEvaluationDto> {
        return this.query(
            'PUT',
            '/matchup-evaluation',
            {
                subject: subject.id,
                object: object.id,
                score: score
            },
            response => response.data as MatchupEvaluationDto
        )
    };

    async saveVideoExcerpt(excerpt: YoutubeVideoExcerpsDto): Promise<number | null> {
        return this.query(
            'PUT',
            '/youtube-video-excerpt',
            excerpt,
            (response) => {
                if (response.status === 201) {
                    return response.data.id;
                } else {
                    return null;
                }
            }
        )
    };

    async saveGuide(guide: GuideHistoryEntryDto): Promise<number | null> {
        return this.query(
            'POST',
            '/guide',
            guide,
            (response) => {
                if (response.status === 201) {
                    return response.data.guideId;
                } else {
                    return null;
                }
            }
        )
    }

    async searchGuidesPaginated(
        query: GuideSearchQueryDto
    ): Promise<GuideSearchPageDto> {
        return this.query(
            'POST',
            '/guide/search',
            query,
            (response) => {
                return response.data;
            }
        )
    }

    async getUserInfo(userId: number): Promise<UserInfoDto> {
        return this.query(
            'GET',
            `/user/${userId}`,
            {},
            response => response.data as UserInfoDto
        )
    };

    async changeUsername(newUsername: string): Promise<null> {
        return this.query(
            'POST',
            `/user/change-username`,
            {newUsername: newUsername},
            response => {
                if (response.status === 422){
                    throw new UsernameOccupiedException(newUsername)
                }
                return null;
            }
        )
    };

}

