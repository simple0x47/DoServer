import { TaskAction } from "./task-action";
import { TaskActionType } from "./task-action-type";

export class User {
    private actions: TaskAction[];
    private hasUsedTranslator: boolean

    public get Id(): string {
        return this.id;
    }

    constructor(private readonly id: string,
        private readonly name: string,
        private readonly email: string) {
        this.actions = [];
        this.hasUsedTranslator = false;
    }

    public addAction(action: TaskAction) {
        if (action.Action === TaskActionType.TRANSLATE) {
            this.hasUsedTranslator = true;
        }

        this.actions.push(action);
    }
}