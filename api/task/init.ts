import { Express } from "express";
import { handleRequest as handleRegisterActionRequest } from "./register-action";
import { handleGetSnapshotRequest } from "./get-snapshot";
import { Authenticator } from "../../authenticator";

export function initializeTaskApi(app: Express) {
    app.post('/task/register_action', (request, response) => {
        Authenticator.getInstance().verifyRequest(request, response, handleRegisterActionRequest);
    });
    app.get('/task/get_snapshot', (request, response) => {
        Authenticator.getInstance().verifyRequest(request, response, handleGetSnapshotRequest);
    });
}