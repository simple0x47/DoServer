import { Request, Response } from "express";
import { StorageSingleton } from "../../storage/storage-singleton";
import { JwtPayload } from "jsonwebtoken";
import { areRegisterActionPayloads } from "../../core/register-action-payload";

export async function handleRequest(token: JwtPayload, request: Request, response: Response) {
    let data = request.body;

    if (!token.sub) {
        console.warn("missing 'sub' from token");
        response.status(500).send("error: missing 'sub' from token");
        return;
    }

    if (!areRegisterActionPayloads(data)) {
        console.log("incorrect request");
        response.status(400).send("error: incorrect request");
        return;
    }

    let storage = await StorageSingleton.getInstance();

    let result = await storage.TaskRepository?.registerActions(token.sub, data);

    if (result) {
        response.status(200).send();
        console.log("[RegisterAction] Successfully registered action.");
    } else {
        response.status(500).send();
        console.warn(`[RegisterAction] Failed to register action.
         { userId: '${token.sub}'`);
    }
}