import { TaskActionType } from "./task-action-type";

export class TaskAction {

    public get Action(): TaskActionType {
        return this.action;
    }

    public get Payload(): string {
        return this.payload;
    }


    public get Timestamp(): number {
        return this.timestamp;
    }


    constructor(private action: TaskActionType,
        private payload: string,
        private timestamp: number) {

    }
}