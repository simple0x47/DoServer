import { Express } from "express";
import { handleRequest as handleRegisterActionRequest } from "./register-action";
import { handleGetSnapshotRequest } from "./get-snapshot";

export function initializeTaskApi(app: Express) {
    app.post('/task/register_action', handleRegisterActionRequest);
    app.post('/task/get_snapshot', handleGetSnapshotRequest);
}