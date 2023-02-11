import { Request, Response } from "express";
import { StorageSingleton } from "../../storage/storage-singleton";
import { JwtPayload } from "jsonwebtoken";

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

export async function handleGetSnapshotRequest(token: JwtPayload, request: Request, response: Response) {
    let data = request.body;

    if (!token.sub) {
        console.warn("missing 'sub' from token");
        response.status(500).send("error: missing 'sub' from token");
        return;
    }

    if (!isGetSnapshotPayload(data)) {
        console.log("incorrect request");
        response.status(400).send("error: incorrect request");
        return;
    }

    let storage = await StorageSingleton.getInstance();

    let result = await storage.TaskRepository?.getSnapshot(token.sub);

    if (!result) {
        response.status(500).send();
        console.warn(`[RegisterAction] Failed to register action.
         { userId: '${data.userId}'`);

        return;
    }

    response.status(200).send(JSON.stringify(result));
}