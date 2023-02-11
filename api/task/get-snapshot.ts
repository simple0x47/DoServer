import { Request, Response } from "express";
import { StorageSingleton } from "../../storage/storage-singleton";

export type GetSnapshotPayload = {
    userId: string
}

function isGetSnapshotPayload(data: any): data is GetSnapshotPayload {
    if (!data) {
        return false;
    }

    let castedData = data as GetSnapshotPayload;

    if (castedData.userId === undefined) {
        return false;
    }

    return true;
}

export async function handleGetSnapshotRequest(request: Request, response: Response) {
    let data = request.body;

    if (!isGetSnapshotPayload(data)) {
        response.status(400).send("error: incorrect request");
        return;
    }

    let storage = await StorageSingleton.getInstance();

    let result = await storage.TaskRepository?.getSnapshot(data.userId);

    if (result) {
        response.status(200).send(JSON.stringify(result));
    } else {
        response.status(500).send();
        console.warn(`[RegisterAction] Failed to register action.
         { userId: '${data.userId}'`);
    }
}