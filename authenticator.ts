import { Request, Response, response } from "express";
import { JwksClient } from "jwks-rsa";
import jwt, { JwtHeader, JwtPayload, SigningKeyCallback } from 'jsonwebtoken';

export class Authenticator {
    private static instance: Authenticator;

    private client?: JwksClient;

    private constructor() {

    }

    private initialize() {
        const authenticatorJwksUri = process.env["AUTHENTICATOR_JWKS_URI"];

        if (!authenticatorJwksUri) {
            return;
        }

        this.client = new JwksClient({
            jwksUri: authenticatorJwksUri,
            timeout: 15000
        })
    }

    public verifyRequest(request: Request, response: Response,
        callback: (token: JwtPayload, request: Request, response: Response) => void) {

        if (!request.headers.authorization) {
            console.log("request is missing authorization header");
            response.status(401).send("error: missing authorization");
            return;
        }

        const token = request.headers.authorization.replace('Bearer ', '');

        jwt.verify(token, (header: JwtHeader, callback: SigningKeyCallback) => {
            if (!this.client) {
                console.error("'client' is not initialized");
                return;
            }

            this.client.getSigningKey(header.kid, function (err, key) {
                var signingKey = key?.getPublicKey();
                callback(null, signingKey);
            })
        }, {}, function (err, decoded) {
            console.log("verify error: " + err);
            if (!decoded) {
                console.log("decoded token is undefined");
                response.status(403).send();
                return;
            }

            if (typeof decoded === "string") {
                console.log("decoded token is a string");
                response.status(403).send();
                return;
            }

            callback(decoded, request, response);
        })
    }

    public static getInstance(): Authenticator {
        if (!Authenticator.instance) {
            Authenticator.instance = new Authenticator();
            Authenticator.instance.initialize();
        }

        return Authenticator.instance;
    }
}