import { TaskActionType } from "./task-action-type"

export type RegisterActionPayload = {
    action: TaskActionType,
    payload: string
}

export function areRegisterActionPayloads(data: any): data is RegisterActionPayload[] {
    if (!data) {
        return false;
    }

    try {
        let castedData = data as RegisterActionPayload[];

        for (let actionPayload of castedData) {
            if (actionPayload.action === undefined) {
                return false;
            }

            if (actionPayload.payload === undefined) {
                return false;
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}