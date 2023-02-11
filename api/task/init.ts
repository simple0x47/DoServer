import { Express } from "express";
import { handleRequest } from "./register-action";

export function initializeTaskApi(app: Express) {
    app.post('/task/register_action', handleRequest);
}