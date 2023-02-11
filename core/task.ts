export class Task {
    private id: string;
    private status: boolean;
    private description: string;

    public get Id(): string {
        return this.id;
    }

    public get Completed(): boolean {
        return this.status;
    }

    public get Description(): string {
        return this.description;
    }

    public set Description(value: string) {
        this.description = value;
    }

    public constructor(id: string) {
        this.id = id;
        this.status = false;
        this.description = "";
    }

    public toggleStatus() {
        this.status != this.status;
    }
}