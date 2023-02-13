import { Express } from "express";
import { getRoles } from "./get-roles";
import { getAllUsers } from "./get-all-users";
import { Authenticator } from "../../authenticator";

export function initializeAuthApi(app: Express) {
    app.get('/user/get_roles/:id', getRoles);
    app.get('/user/get_all', (request, response) => {
        Authenticator.getInstance().verifyRequest(request, response, getAllUsers);
    });
}
