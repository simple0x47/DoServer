import { Request, Response } from "express";
import { StorageSingleton } from "../../storage/storage-singleton";
import { JwtPayload } from "jsonwebtoken";

export async function handleGetSnapshotRequest(token: JwtPayload, request: Request, response: Response) {
    if (!token.sub) {
        console.warn("missing 'sub' from token");
        response.status(500).send("error: missing 'sub' from token");
        return;
    }

    let storage = await StorageSingleton.getInstance();

    let result = await storage.TaskRepository?.getSnapshot(token.sub);

    if (!result) {
        response.status(500).send();
        console.warn(`[RegisterAction] Failed to get snapshot.
         { userId: '${token.sub}'`);

        return;
    }

    response.status(200).send(JSON.stringify(result));
}