import { Express } from "express";
import { handleRequest as handleRegisterActionRequest } from "./register-action";
import { handleGetSnapshotRequest } from "./get-snapshot";
import { Authenticator } from "../auth/authenticator";

export function initializeTaskApi(app: Express) {
    app.post('/task/register_action', (response, request) => {
        Authenticator.getInstance().verifyRequest(response, request, handleRegisterActionRequest);
    });
    app.get('/task/get_snapshot', (response, request) => {
        Authenticator.getInstance().verifyRequest(response, request, handleGetSnapshotRequest);
    });
}