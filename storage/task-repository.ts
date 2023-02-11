import { Task } from "../core/task";
import { TaskActionType } from "../core/task-action-type";
import { Client } from "ts-postgres";
import { TaskCollection } from "../core/task-collection";

type PostgresPrimitive = string | number | bigint | boolean | Object | undefined;

export class TaskRepository {
    constructor(private client: Client) {

    }

    public async registerAction(userId: string, actionType: TaskActionType, actionPayload: string): Promise<boolean> {
        try {
            let query = `INSERT INTO USER_ACTIONS (USER_ID, ACTION_TYPE, ACTION_PAYLOAD) 
            VALUES ('${userId}', ${actionType}, '${actionPayload}')`;

            let taskId = JSON.parse(actionPayload).taskId;
            if (taskId) {
                query = `INSERT INTO USER_ACTIONS (USER_ID, TASK_ID, ACTION_TYPE, ACTION_PAYLOAD) 
                VALUES ('${userId}', '${taskId}', ${actionType}, '${actionPayload}')`;
            }

            await this.client.query(query);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
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
}