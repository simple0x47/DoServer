import { Task } from "./task";

export class TaskCollection {
    private tasks: Map<string, Task>;

    constructor() {
        this.tasks = new Map();
    }

    public create(taskId: string) {
        const task = new Task(taskId);

        this.tasks.set(taskId, task);
    }

    public toggleStatus(taskId: string) {
        this.tasks.get(taskId)?.toggleStatus();
    }

    public updateDescription(taskId: string, description: string) {
        let task = this.tasks.get(taskId);

        if (!task) {
            return;
        }

        task.Description = description;
    }

    public clearDone() {
        let taskIdsToBeRemoved: string[] = [];

        for (let keyValue of this.tasks) {
            if (keyValue[1].Completed) {
                taskIdsToBeRemoved.push(keyValue[0]);
            }
        }

        for (let taskId of taskIdsToBeRemoved) {
            this.tasks.delete(taskId);
        }
    }

    public toArray(): Task[] {
        let result: Task[] = [];

        for (let keyValue of this.tasks) {
            result.push(keyValue[1]);
        }

        return result;
    }
}