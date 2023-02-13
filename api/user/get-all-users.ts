import { Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import { StorageSingleton } from "../../storage/storage-singleton";
import { User } from "../../core/user";
import { PartialAuth0User } from "../../core/partial-auth0-user";

export function getAllUsers(token: JwtPayload, request: Request, response: Response) {
    console.log("get all users");

    // Send timeout response if we cannot get all users in less than 15 seconds.
    setTimeout(() => {
        if (!response.closed) {
            response.status(504).send("timeout");
        }
    }, 15000);

    StorageSingleton.getInstance().then(
        storage => {
            const token = storage.Auth0TokenRepository.Token;

            if (token.length === 0) {
                response.status(503).send("server is starting");
                return;
            }

            fetch(`https://simple0x47.eu.auth0.com/api/v2/users`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }).then(
                rolesResponse => rolesResponse.json())
                .then(data => {
                    // Timeout has already been triggered.
                    if (response.closed) {
                        return;
                    }

                    getUsersFromAuth0JsonResponse(data).then(
                        users => {
                            response.status(200).send(JSON.stringify(users));
                        }
                    );
                });
        }
    );
}

async function getUsersFromAuth0JsonResponse(data: any): Promise<User[]> {
    let users: User[] = [];

    let partialUsers = data as PartialAuth0User[];

    if (!partialUsers) {
        console.error("failed to parse partial users from response");
        return users;
    }

    for (let partialUser of partialUsers) {
        let user = new User(partialUser.user_id, partialUser.name, partialUser.email);

        let storage = await StorageSingleton.getInstance();
        let actions = await storage.TaskRepository?.getActionsForUserId(user.Id);

        if (!actions) {
            console.error(`failed to get actions for user with id '${user.Id}'`);
            continue;
        }

        for (let action of actions) {
            user.addAction(action);
        }

        users.push(user);
    }
    return users;
}