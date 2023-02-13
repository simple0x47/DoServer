import { Client } from "ts-postgres";
import { TaskRepository } from "./task-repository";
import { Auth0TokenRepository } from "./auth0-token-repository";

export class StorageSingleton {
    private static instance: StorageSingleton;

    private client: Client;
    private taskRepository?: TaskRepository;
    private auth0TokenRepository: Auth0TokenRepository;

    public get TaskRepository(): TaskRepository | undefined {
        return this.taskRepository;
    }

    public get Auth0TokenRepository(): Auth0TokenRepository {
        return this.auth0TokenRepository;
    }

    private constructor() {
        this.client = new Client();
        this.client.config.host = process.env["DO_POSTGRESQL_HOST"];
        this.client.config.database = process.env["DO_POSTGRESQL_DATABASE"];
        this.client.config.user = process.env["DO_POSTGRESQL_USER"];
        this.client.config.password = process.env["DO_POSTGRESQL_PASSWORD"];

        const url = process.env["AUTH0_URL"]!;
        const clientId = process.env["AUTH0_CLIENT_ID"]!;
        const clientSecret = process.env["AUTH0_CLIENT_SECRET"]!;
        const audience = process.env["AUTH0_AUDIENCE"]!;

        this.auth0TokenRepository = new Auth0TokenRepository(url, clientId, clientSecret, audience);
    }

    private async initialize() {
        await this.client.connect();

        this.taskRepository = new TaskRepository(this.client);
    }

    public static async getInstance(): Promise<StorageSingleton> {
        if (!StorageSingleton.instance) {
            StorageSingleton.instance = new StorageSingleton();
            await StorageSingleton.instance.initialize();
        }

        return StorageSingleton.instance;
    }
}