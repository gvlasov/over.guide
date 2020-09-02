import Backend from "@/js/Backend";
import TrainingGoalDto from "data/dto/TrainingGoalDto";
import axios, {AxiosResponse} from "axios";

export default class MyTrainingGoalsCache {

    private static _instance: MyTrainingGoalsCache;
    public static instance(): MyTrainingGoalsCache {
        if (typeof MyTrainingGoalsCache._instance === 'undefined') {
            MyTrainingGoalsCache._instance = new MyTrainingGoalsCache(new Backend(axios));
        }
        return MyTrainingGoalsCache._instance;
    }

    private readonly _goalIds: number[];
    public readonly pendingGoalIds: number[];

    private static readonly localStorageKey = 'my-training-goals';
    private static readonly pendingGoalsLocalStorageKey = 'my-training-goals__not-sent';

    private constructor(private readonly backend: Backend) {
        const item = localStorage.getItem(MyTrainingGoalsCache.localStorageKey);
        if (item === null) {
            this._goalIds = [];
        } else {
            this._goalIds = JSON.parse(item)
        }
        const notSentGoals = localStorage.getItem(MyTrainingGoalsCache.pendingGoalsLocalStorageKey);
        if (notSentGoals === null) {
            this.pendingGoalIds = [];
        } else {
            this.pendingGoalIds = JSON.parse(notSentGoals);
        }
    }

    async loadGoals(): Promise<TrainingGoalDto[]> {
        return this.backend.getMyTrainingGoals()
            .then((goals) => {
                this._goalIds.splice(
                    0,
                    this._goalIds.length,
                    ...goals.map(g => g.guide.guideId as number)
                );
                this.cacheGoals();
                return goals;
            });
    }

    private cacheGoals() {
        localStorage.setItem(
            MyTrainingGoalsCache.localStorageKey,
            JSON.stringify(this._goalIds)
        );
    }
    private cacheNotSentGoals() {
        localStorage.setItem(
            MyTrainingGoalsCache.pendingGoalsLocalStorageKey,
            JSON.stringify(this.pendingGoalIds)
        );
    }

    savePending(guideId: number) {
        if (!this.pendingGoalIds.includes(guideId)) {
            this.pendingGoalIds.push(guideId);
            this.cacheNotSentGoals();
        }
    }

    removePending(guideId: number) {
        const notSentGoalIndex = this.pendingGoalIds.indexOf(guideId);
        if (notSentGoalIndex !== -1) {
            this.pendingGoalIds.splice(notSentGoalIndex, 1)
            this.cacheNotSentGoals()
        }
    }

    async deliverPending(
        onDeliver: (guideId: number, response: AxiosResponse) => void
    ): Promise<void> {
        let handled = 0;
        const promises = []
        for (let guideId of this.pendingGoalIds) {
            promises.push(
                this.addGoal(guideId)
                    .then(response => {
                        if (response.body === 'already added') {
                            handled++
                        } else if (response.status === 201) {
                            onDeliver(guideId, response)
                            handled++
                        }
                    })
            )
        }
        return Promise.all(promises)
            .then(result => {
                if (handled > 0) {
                    this.pendingGoalIds.splice(0, this.pendingGoalIds.length);
                    this.cacheNotSentGoals()
                }
            })
    }

    async addGoal(guideId: number, order?: number): Promise<any> {
        this.savePending(guideId)
        return this.backend.addTrainingGoal(guideId, order)
            .then((response) => {
                this._goalIds.splice(
                    0,
                    this._goalIds.length,
                    ...[...this._goalIds, guideId]
                );
                this.cacheGoals();
                this.removePending(guideId)
                return response
            })
            .catch(e => {
                if (e.response.status !== 403) {
                    throw e;
                }
            });
    }

    async removeGoal(guideId: number): Promise<any> {
        this.removePending(guideId)
        return this.backend.removeTrainingGoal(guideId)
            .then(() => {
                this._goalIds.splice(
                    this._goalIds.indexOf(guideId),
                    1
                );
                this.cacheGoals();
            });
    }

    async saveGoalsOrder(goals: number[]): Promise<void> {
        return this.backend.reorderTrainingGoals(goals)
            .then(() => {
                this._goalIds.splice(0, this._goalIds.length, ...goals);
                this.cacheGoals();
            });
    }

    async addAndReorder(newGoalId: number, newGoalsOrder: number[]): Promise<void> {
        return this.backend.addAndReorderTrainingGoals(newGoalId, newGoalsOrder)
            .then(() => {
                this._goalIds.splice(0, this._goalIds.length, ...newGoalsOrder);
                this.cacheGoals();
            });
    }

    get goalIds(): number[] {
        return this._goalIds;
    }


}
