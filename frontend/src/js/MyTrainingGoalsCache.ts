import Backend from "@/js/Backend";
import TrainingGoalDto from "data/dto/TrainingGoalDto";

export default class MyTrainingGoalsCache {

    private _goalIds: number[];

    private static readonly localStorageKey = 'my-training-goals';

    constructor(private readonly backend: Backend) {
        const item = localStorage.getItem(MyTrainingGoalsCache.localStorageKey);
        if (item === null) {
            this._goalIds = [];
        } else {
            this._goalIds = JSON.parse(item)
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
        console.log(this._goalIds);
    }

    async addGoal(guideId: number, order?: number): Promise<any> {
        return this.backend.addTrainingGoal(guideId, order)
            .then(() => {
                this._goalIds.splice(
                    0,
                    this._goalIds.length,
                    ...[...this._goalIds, guideId]
                );
                this.cacheGoals();
            });
    }

    async removeGoal(guideId: number): Promise<any> {
        const index = this._goalIds.indexOf(guideId);
        if (index === -1) {
            throw new Error(`No training goal with id ${guideId}`)
        }
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

    async addAndReorder(newGoalIds: number, newGoalsOrder: number[]): Promise<void> {
        return this.backend.addAndReorderTrainingGoals(newGoalIds, newGoalsOrder)
            .then(() => {
                this._goalIds.splice(0, this._goalIds.length, ...newGoalsOrder);
                this.cacheGoals();
            });
    }

    get goalIds(): number[] {
        return this._goalIds;
    }


}
