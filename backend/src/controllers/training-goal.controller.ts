import {
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    NotFoundException,
    Param,
    Post,
    Req,
    Res,
    UseGuards
} from '@nestjs/common';
import {AuthService} from "src/services/auth.service";
import {Request} from "express";
import {AuthenticatedGuard} from "src/services/authenticated.guard";
import {Guide} from "src/database/models/Guide";
import {User2TrainingGoal} from "src/database/models/User2TrainingGoal";
import {Sequelize} from "sequelize-typescript";
import {SEQUELIZE} from "src/constants";
import {QueryTypes} from "sequelize";
import {User} from "src/database/models/User";
import {GuideHistoryEntry} from "src/database/models/GuideHistoryEntry";
import {GuideDescriptor} from "src/database/models/GuideDescriptor";
import {GuidePartText} from "src/database/models/GuidePartText";
import {GuidePartVideo} from "src/database/models/GuidePartVideo";
import {YoutubeVideoExcerpt} from "src/database/models/YoutubeVideoExcerpt";
import TrainingGoalDto from "data/dto/TrainingGoalDto";
import AddAndReorderTrainingGoalDto
    from "data/dto/AddAndReorderTrainingGoalDto";
import arrayXor from 'lodash.xor';

@Controller('my-training-goals')
export class TrainingGoalController {

    constructor(
        @Inject(SEQUELIZE) private readonly sequelize: Sequelize,
        private readonly authService: AuthService,
    ) {

    }

    @Get()
    @UseGuards(AuthenticatedGuard)
    async myTrainingGoals(
        @Req() request: Request
    ) {
        const user = await this.authService.getUser(request)
        const userWithGoals = await User.findOne({
            where: {
                id: user.id
            },
            include: [
                {
                    model: Guide,
                    as: 'trainingGoals',
                    include: [
                        {
                            model: GuideHistoryEntry,
                            as: 'heads',
                            include: [
                                {
                                    model: Guide,
                                    as: 'guide',
                                    include: [
                                        {
                                            model: User,
                                            as: 'creator',
                                        }
                                    ]
                                },
                                {
                                    model: GuideDescriptor,
                                    as: 'descriptor',
                                    include: [{all: true}]
                                },
                                {
                                    model: GuidePartText,
                                    as: 'guidePartTexts',
                                },
                                {
                                    model: GuidePartVideo,
                                    as: 'guidePartVideos',
                                    include: [
                                        {
                                            model: YoutubeVideoExcerpt,
                                            as: 'excerpt',
                                        }
                                    ]
                                },
                            ]
                        }
                    ]
                }
            ]
        })
        return userWithGoals.trainingGoals
            .map(goal => {
                return {
                    guide: goal.head.toDto(),
                    order: goal.User2TrainingGoal.order,
                } as TrainingGoalDto
            })
            .sort((a, b) => {
                return -(a.order - b.order);
            })
    }

    @Delete(':id')
    @UseGuards(AuthenticatedGuard)
    async delete(
        @Req() request,
        @Res() response,
        @Param() params
    ) {
        const user = await this.authService.getUser(request)
        await User2TrainingGoal.destroy({
            where: {
                userId: user.id,
                guideId: params.id,
            },
            force: true,
        });
        response.status(HttpStatus.NO_CONTENT);
        response.send();
    }

    @Post('reorder')
    @UseGuards(AuthenticatedGuard)
    async reorder(
        @Req() request,
        @Res() response
    ) {
        const user = await this.authService.getUser(request)
        const newOrderedGuideIds: number[] = request.body
        await User2TrainingGoal.findAll({
            where: {
                userId: user.id
            }
        })
            .then(async goals => {
                if (newOrderedGuideIds.length !== goals.length) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send();
                    return;
                }
                const updatedGoals = [];
                for (let goal of goals) {
                    const newOrder = goals.length - newOrderedGuideIds.indexOf(goal.guideId);
                    if (newOrder === -1) {
                        response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                        response.send();
                        return;
                    }
                    if (goal.order !== newOrder) {
                        updatedGoals.push(goal)
                        goal.order = newOrder;
                    }
                }
                const saves = [];
                for (let goal of updatedGoals) {
                    saves.push(goal.save())
                }
                Promise.all(saves)
                    .then(() => {
                        response.status(HttpStatus.NO_CONTENT)
                        response.send();
                    })
            })
    }

    @Post('add-and-reorder')
    @UseGuards(AuthenticatedGuard)
    async addAndReorder(
        @Req() request,
        @Res() response
    ) {
        const user = await this.authService.getUser(request)
        const dto: AddAndReorderTrainingGoalDto = request.body
        if (!dto.newGoalsOrder.includes(dto.newGoalId)) {
            response.status(HttpStatus.UNPROCESSABLE_ENTITY)
            response.send();
            return;
        }
        User2TrainingGoal.findAll({
            where: {
                userId: user.id,
                guideId: dto.newGoalsOrder,
            }
        })
            .then(async goals => {
                if (
                    arrayXor([...goals.map(g => g.guideId), dto.newGoalId], dto.newGoalsOrder).length !== 0
                ) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send({clientAndServerContentDiffer: true});
                    return;
                }
                const goalSaves = [];
                for (let goal of goals) {
                    goal.order = dto.newGoalsOrder.length - dto.newGoalsOrder.indexOf(goal.guideId) - 1;
                    goalSaves.push(goal.save())
                }
                return Promise.all(
                    [
                        ...goalSaves,
                        User2TrainingGoal.create({
                            userId: user.id,
                            guideId: dto.newGoalId,
                            order: dto.newGoalsOrder.length - dto.newGoalsOrder.indexOf(dto.newGoalId) - 1
                        })
                    ]
                )
                    .then(() => {
                        response.status(HttpStatus.NO_CONTENT)
                        response.send();
                    })
            })
    }


    @Post(':id')
    @UseGuards(AuthenticatedGuard)
    async add(
        @Req() request,
        @Res() response,
        @Param() params
    ) {
        const guide = await Guide.findOne({
            where: {
                id: params.id
            }
        })
        if (guide === null) {
            throw new NotFoundException()
        }
        const user = await this.authService.getUser(request)
        let order: number | undefined = request.body.order;
        await this.sequelize.query(
                `
                    SELECT \`order\`, guideId
                    from User2TrainingGoal
                    where userId = :userId
            `,
            {
                raw: true,
                type: QueryTypes.SELECT,
                replacements: {
                    userId: user.id,
                }
            }
        )
            .then(async (rows: any) => {
                if (rows.find(r => r.guideId === guide.id)) {
                    response.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    response.send('already added')
                    return;
                }
                const orders = rows.map(r => r.order);
                if (typeof order !== 'undefined') {
                    let indexOfOrder = orders.indexOf(order);
                    if (indexOfOrder !== -1) {
                        do {
                            indexOfOrder++;
                        } while (indexOfOrder !== orders.length && orders[indexOfOrder] !== orders[indexOfOrder - 1] + 1);
                        order = orders[indexOfOrder - 1] + 1;
                    }
                } else if (orders.length === 0) {
                    order = 0;
                } else {
                    order = Math.max(...orders) + 1;
                }
                return User2TrainingGoal.create({
                    userId: user.id,
                    guideId: guide.id,
                    order: order
                })
                    .then(() => {
                        response.status(HttpStatus.CREATED)
                        response.send()
                    });
            });
    }

}
