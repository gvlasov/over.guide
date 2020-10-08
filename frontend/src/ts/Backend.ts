import AlternativeDto from "data/dto/AlternativeDto";
import PickSuggestion from "./PickSuggestion";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";
import axios, {AxiosResponse, AxiosStatic, Method} from "axios";
import PickContext from "./PickContext";
import HeroDto from "data/dto/HeroDto"
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
import env from '../env/dev'
import GuideHistoryEntryReadDto from "data/dto/GuideHistoryEntryReadDto";
import GuideSearchPageDto from "data/dto/GuideSearchPageDto";
import GuideSearchQueryDto from "data/dto/GuideSearchQueryDto";
import UserInfoDto from "data/dto/UserInfoDto";
import UsernameOccupiedException from "@/ts/UsernameOccupiedException";
import Authentication from "@/ts/Authentication";
import OrderedGuideHeadDto from "data/dto/OrderedGuideHeadDto";
import {ExistingGuideHeadDto} from "data/dto/GuideHeadDto";
import GuideHistoryEntryCreateDto from "data/dto/GuideHistoryEntryCreateDto";
import GuideHistoryEntryAppendDto from "data/dto/GuideHistoryEntryAppendDto";
import CommentReadDto from "data/dto/CommentReadDto";
import PostVso from "@/ts/vso/PostVso";
import CommentCreateDto from "data/dto/CommentCreateDto";
import PostTypeId from "data/PostTypeId";
import VoteDto from "data/dto/VoteDto";
import ReportReasonId from "data/ReportReasonId";
import ReportDto from "data/dto/ReportDto";

const querystring = require('query-string')

const auth = new Authentication()
export default class Backend {
    private readonly axios: AxiosStatic;
    private readonly rootUrl: string;

    private static _instance: Backend

    static get instance(): Backend {
        if (Backend._instance === void 0) {
            Backend._instance = new Backend(axios)
        }
        return Backend._instance;
    }

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

    async getMyTrainingGoals(): Promise<OrderedGuideHeadDto[]> {
        return this.query(
            'GET',
            '/my-training-goals',
            {},
            response => response.data as OrderedGuideHeadDto[]
        )
    };

    async addTrainingGoal(guideId: number, order?: number): Promise<GuideHistoryEntryReadDto[]> {
        return this.query(
            'POST',
            '/my-training-goals/' + guideId,
            {
                order
            },
            response => response.data
        )
    }

    async removeTrainingGoal(guideId: number): Promise<GuideHistoryEntryReadDto[]> {
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

    async saveVideoExcerpt(excerpt: YoutubeVideoExcerptDto): Promise<number | null> {
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

    async getGuide(guideId: number): Promise<ExistingGuideHeadDto> {
        return this.query(
            'GET',
            `/guide/${guideId}`,
            {},
            (response) => response.data
        )
    }

    async getGuidesByVideoId(videoId: string): Promise<ExistingGuideHeadDto[]> {
        return this.query(
            'GET',
            `/guide/search-by-video/${videoId}`,
            {},
            (response) => response.data,
        )
    }

    async createGuide(guide: GuideHistoryEntryCreateDto): Promise<number> {
        return this.query(
            'POST',
            '/guide/create',
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

    async updateGuide(guide: GuideHistoryEntryAppendDto): Promise<void> {
        return this.query(
            'POST',
            '/guide/update',
            guide,
            (response) => {
            }
        )
    }

    async deactivateGuide(guideId: number): Promise<void> {
        return this.query(
            'POST',
            `/guide/deactivate`,
            {id: guideId},
            () => {
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
                if (response.status === 422) {
                    throw new UsernameOccupiedException(newUsername)
                }
                return null;
            }
        )
    };

    async getComments(host: PostVso): Promise<CommentReadDto[]> {
        return this.query(
            'GET',
            `/comment/${host.postType}/${host.postId}`,
            {},
            response => response.data
        )
    }

    async createComment(dto: CommentCreateDto): Promise<CommentReadDto> {
        return this.query(
            'POST',
            `/comment/create`,
            dto,
            response => response.data
        )
    }

    async upvote(postTypeId: PostTypeId, postId: number): Promise<AxiosResponse> {
        return this.query(
            'PUT',
            `/vote`,
            {
                postId,
                postTypeId,
            } as VoteDto,
            response => response
        )
    }

    async removeUpvote(postTypeId: PostTypeId, postId: number): Promise<void> {
        return this.query(
            'DELETE',
            `/vote`,
            {
                postId,
                postTypeId,
            } as VoteDto,
            response => {
            }
        )
    }

    async report(
        postTypeId: PostTypeId,
        postId: number,
        reportReasonId: ReportReasonId
    ): Promise<void> {
        return this.query(
            'POST',
            `/report`,
            {
                postId,
                postTypeId,
                reportReasonId,
            } as ReportDto,
            response => {
            }
        )
    }

    async deleteComment(
        commentId: number,
    ): Promise<void> {
        return this.query(
            'DELETE',
            `/comment/${commentId}`,
            {},
            response => {
            }
        )
    }

}

