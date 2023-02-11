import { Client } from "ts-postgres";
import { TaskRepository } from "./task-repository";

export class StorageSingleton {
    private static instance: StorageSingleton;

    private client: Client;
    private taskRepository?: TaskRepository;

    public get TaskRepository(): TaskRepository | undefined {
        return this.taskRepository
    }

    private constructor() {
        this.client = new Client();
        this.client.config.host = process.env["DO_POSTGRESQL_HOST"];
        this.client.config.database = process.env["DO_POSTGRESQL_DATABASE"];
        this.client.config.user = process.env["DO_POSTGRESQL_USER"];
        this.client.config.password = process.env["DO_POSTGRESQL_PASSWORD"];
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