import { Request, Response } from "express";
import { TaskActionType } from "../../core/task-action-type";
import { StorageSingleton } from "../../storage/storage-singleton";

export type RegisterActionPayload = {
    userId: string,
    actionType: TaskActionType,
    actionPayload: string
}

function isRegisterActionPayload(data: any): data is RegisterActionPayload {
    if (!data) {
        return false;
    }

    let castedData = data as RegisterActionPayload;

    if (castedData.userId === undefined) {
        return false;
    }

    if (castedData.actionType === undefined) {
        return false;
    }

    if (castedData.actionPayload === undefined) {
        return false;
    }

    return true;
}

export async function handleRequest(request: Request, response: Response) {
    let data = request.body;

    if (!isRegisterActionPayload(data)) {
        response.status(400).send("error: incorrect request");
        return;
    }

    let storage = await StorageSingleton.getInstance();

    let result = await storage.TaskRepository?.registerAction(data.userId, data.actionType, data.actionPayload);

    if (result) {
        response.status(200).send();
        console.log("[RegisterAction] Successfully registered action.");
    } else {
        response.status(500).send();
        console.warn(`[RegisterAction] Failed to register action.
         { userId: '${data.userId}', actionType: '${data.actionType}', actionPayload: '${data.actionPayload}`);
    }
}