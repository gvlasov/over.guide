import AlternativeDto from "data/dto/AlternativeDto";
import PickSuggestion from "./PickSuggestion";
import axios, {AxiosResponse, AxiosStatic, Method} from "axios";
import PickContext from "./PickContext";
import YoutubeVideoExcerptDto from "data/dto/YoutubeVideoExcerptDto";
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
import {CommentReadDto} from "data/dto/CommentReadDto";
import PostVso from "@/ts/vso/PostVso";
import CommentCreateDto from "data/dto/CommentCreateDto";
import PostTypeId from "data/PostTypeId";
import VoteDto from "data/dto/VoteDto";
import ReportReasonId from "data/ReportReasonId";
import ReportDto from "data/dto/ReportDto";
import CommentUpdateDto from "data/dto/CommentUpdateDto";
import ReportPageDto from "data/dto/ReportPageDto";
import ReportQueryDto from "data/dto/ReportQueryDto";
import SentenceCreateDto from "data/dto/SentenceCreateDto";
import GuideSearchByAuthorQuery from "data/dto/GuideSearchByAuthorQuery";
import NotificationsPageDto from "data/dto/NotificationsPageDto";
import NotificationsPageQueryDto from "data/dto/NotificationsPageQueryDto";
import MatchupEvaluationVso from "@/ts/vso/MatchupEvaluationVso";
import HeroOpposition from "@/ts/vso/HeroOpposition";
import MatchupEvaluationDto from "data/dto/MatchupEvaluationDto";

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
        if (process.env.BACKEND_BASE_URL === void 0) {
            throw new Error('Backend URL not set')
        }
        this.rootUrl = process.env.BACKEND_BASE_URL
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

    async evaluateMatchups(
        evaluations: MatchupEvaluationVso[]
    ): Promise<void> {
        return this.query(
            'PUT',
            '/matchup-evaluation',
            evaluations.map((e => {
                return {
                    subjectId: e.opposition.left.id,
                    objectId: e.opposition.right.id,
                    score: e.score
                }
            })),
            response => {}
        )
    };

    async removeMatchupEvaluations(
        oppositions: HeroOpposition[]
    ): Promise<void> {
        return this.query(
            'POST',
            '/matchup-evaluation/remove',
            oppositions.map((o => [o.left.id, o.right.id])),
            response => {}
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

    async searchGuidesByAuthorPaginated(
        query: GuideSearchByAuthorQuery
    ): Promise<GuideSearchPageDto> {
        return this.query(
            'POST',
            '/guide/search-by-author',
            query,
            (response) => {
                return response.data
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

    async editComment(
        commentId: number,
        content: string
    ): Promise<void> {
        return this.query(
            'POST',
            `/comment/edit`,
            {
                id: commentId,
                content,
            } as CommentUpdateDto,
            response => {
            }
        )
    }

    async searchReportsPaginated(clientAlreadyHasReportIds: number[]): Promise<ReportPageDto> {
        return this.query(
            'POST',
            `/report/search`,
            {
                clientAlreadyHasReportIds
            } as ReportQueryDto,
            response => {
                return response.data;
            }
        )
    }

    async createSentence(dto: SentenceCreateDto): Promise<void> {
        return this.query(
            'PUT',
            `/sentence`,
            dto,
            response => {
            }
        )
    }

    async handleReport(reportId: number): Promise<void> {
        return this.query(
            'PUT',
            `/report/${reportId}/handle`,
            {},
            response => {
            }
        )
    }

    async getFeedNotifications(clientAlreadyHasIds: number[]): Promise<NotificationsPageDto> {
        return this.query(
            'POST',
            `/notifications/feed`,
            {
                clientAlreadyHasIds: clientAlreadyHasIds,
            } as NotificationsPageQueryDto,
            response => response.data
        )
    }

    async markNotificationsRead(notificationIds: number[]): Promise<void> {
        return this.query(
            'POST',
            `/notifications/mark-read`,
            notificationIds,
            response => {
            }
        )
    }

    async markAllNotificationsRead(): Promise<void> {
        return this.query(
            'POST',
            `/notifications/mark-all-read`,
            {},
            response => {
            }
        )
    }

    async getMyMatchupEvaluations(): Promise<MatchupEvaluationDto[]> {
        return this.query(
            'GET',
            `/matchup-evaluation/my`,
            {},
            response => response.data as MatchupEvaluationDto[]
        )
    }

    async getYoutubeStreamUrl(videoId: string): Promise<string> {
        return this.query(
            'GET',
            `/youtube/video-stream-url/${videoId}`,
            {},
            response => response.data as string
        )
    }

}

