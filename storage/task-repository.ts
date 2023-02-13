import { Task } from "../core/task";
import { TaskActionType } from "../core/task-action-type";
import { Client } from "ts-postgres";
import { TaskCollection } from "../core/task-collection";
import { RegisterActionPayload } from "../core/register-action-payload";
import { TaskAction } from "../core/task-action";

type PostgresPrimitive = string | number | bigint | boolean | Object | undefined;

export class TaskRepository {
    constructor(private client: Client) {

    }

    public async registerActions(userId: string, payload: RegisterActionPayload[]): Promise<boolean> {
        try {
            let queries = this.generateInsertsFromRegisterPayloads(userId, payload);

            for (let query of queries) {
                await this.client.query(query);
            }

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }

    private generateInsertsFromRegisterPayloads(userId: string, payload: RegisterActionPayload[]): string[] {
        let queries: string[] = [];
        let i = 0;
        for (let action of payload) {
            if (!action) {
                continue;
            }

            let taskId = JSON.parse(action.payload).taskId;
            if (taskId) {
                queries[i] = `INSERT INTO USER_ACTIONS (USER_ID, TASK_ID, ACTION_TYPE, ACTION_PAYLOAD) 
                VALUES ('${userId}', '${taskId}', ${action.action}, '${action.payload}');`;
            } else {
                queries[i] = `INSERT INTO USER_ACTIONS (USER_ID, ACTION_TYPE, ACTION_PAYLOAD) 
                VALUES ('${userId}', ${action.action}, '${action.payload}');`;
            }

            i += 1;
        }

        return queries;
    }

    public async getSnapshot(userId: string): Promise<Task[]> {
        try {
            let taskCollection = new TaskCollection();
            const result = await this.client.query(`SELECT TASK_ID, ACTION_TYPE, ACTION_PAYLOAD FROM USER_ACTIONS WHERE USER_ID=$1 ORDER BY ID ASC`, [userId]);

            for (let row of result) {
                let taskId = row.get("task_id")?.valueOf();
                let actionType = row.get("action_type")?.valueOf();
                let actionPayload = row.get("action_payload")?.valueOf();

                this.handleAction(taskCollection, taskId, actionType, actionPayload);
            }

            return taskCollection.toArray();
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    private handleAction(taskCollection: TaskCollection,
        taskId: PostgresPrimitive,
        actionType: PostgresPrimitive,
        actionPayload: PostgresPrimitive) {
        if (typeof actionType !== "number") {
            return;
        }

        switch (actionType) {
            case TaskActionType.CREATE:
            case TaskActionType.TOGGLE_STATUS:
            case TaskActionType.UPDATE_DESCRIPTION:
                if (typeof taskId !== "string") {
                    return;
                }

                if (actionType == TaskActionType.CREATE) {
                    taskCollection.create(taskId);
                    return;
                }

                if (actionType == TaskActionType.TOGGLE_STATUS) {
                    taskCollection.toggleStatus(taskId);
                    return;
                }

                if (actionType == TaskActionType.UPDATE_DESCRIPTION) {
                    if (typeof actionPayload !== "object") {
                        console.warn("actionPayload is not an 'object'");
                        return;
                    }

                    if (!('taskDescription' in actionPayload)) {
                        console.warn("actionPayload is missing 'taskDescription'");
                        return;
                    }

                    if (typeof actionPayload.taskDescription !== "string") {
                        console.warn("actionPayload's 'taskDescription' is not a string");
                        return;
                    }

                    taskCollection.updateDescription(taskId, actionPayload.taskDescription);
                }

                break;
            case TaskActionType.CLEAR_DONE:
                taskCollection.clearDone();
                break;
        }
    }

    public async getActionsForUserId(userId: string): Promise<TaskAction[]> {
        let actions: TaskAction[] = [];

        const result = this.client.query("SELECT ACTION_TYPE, ACTION_PAYLOAD, REGISTERED_AT FROM USER_ACTIONS WHERE USER_ID=$1 ORDER BY ID ASC", [userId]);

        for await (let row of result) {
            let actionType = row.get("action_type")?.valueOf();
            let actionPayload = row.get("action_payload")?.valueOf();
            let actionRegisteredAt = row.get("registered_at")?.valueOf();

            if (actionType === undefined || (typeof actionType !== "number")) {
                console.warn("invalid value detected for actionType");
                continue;
            }

            if (actionPayload === undefined || (typeof actionPayload !== "object")) {
                console.warn("invalid value detected for actionPayload");
                continue;
            }

            if (actionRegisteredAt === undefined || (typeof actionRegisteredAt !== "number")) {
                console.warn("invalid value detected for actionRegisteredAt");
                continue;
            }

            actions.push(new TaskAction(actionType, JSON.stringify(actionPayload), actionRegisteredAt));
        }

        return actions;
    }
}