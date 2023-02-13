import { Express } from "express";
import { getRoles } from "./get-roles";

export function initializeAuthApi(app: Express) {
    app.get('/user/get_roles/:id', getRoles);
}
