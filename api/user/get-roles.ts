import { Request, Response } from "express";
import fetch from "node-fetch";
import { StorageSingleton } from "../../storage/storage-singleton";

export function getRoles(request: Request, response: Response) {
    if (!("id" in request.params)) {
        response.status(500).send();
        return;
    }

    // Send timeout response if we cannot get the roles in less than 10 seconds.
    setTimeout(() => {
        if (!response.closed) {
            response.status(504).send("timeout");
        }
    }, 10000);

    StorageSingleton.getInstance().then(
        storage => {
            const userId: string = request.params.id;
            const token = storage.Auth0TokenRepository.Token;

            if (token.length === 0) {
                response.status(503).send("server is starting");
                return;
            }

            fetch(`https://simple0x47.eu.auth0.com/api/v2/users/${userId}/roles`, {
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

                    response.status(200).send(data);
                });
        }
    );
}