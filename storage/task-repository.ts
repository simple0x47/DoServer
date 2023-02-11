import { TaskActionType } from "../core/task-action-type";
import { Client } from "ts-postgres";

export class TaskRepository {
    constructor(private client: Client) {

    }

    public async registerAction(userId: string, actionType: TaskActionType, actionPayload: string): Promise<boolean> {
        try {
            await this.client.query(`INSERT INTO USER_ACTIONS (USER_ID, ACTION_TYPE, ACTION_PAYLOAD) 
                VALUES ('${userId}', ${actionType}, '${actionPayload}')`);

            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    }
}