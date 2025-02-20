import type RapidcronClient from "../rapidcron-client";
import { TaskRun } from "../types/tasks";

type RawTaskRun = Omit<TaskRun, "startedAt" | "completedAt"> & {
    startedAt: number;
    completedAt: number;
};

export default class Runs {
    private client: RapidcronClient;

    constructor(client: RapidcronClient) {
        this.client = client;
    }

    all = async (): Promise<TaskRun[]> => {
        return this.client.get("/runs", (original: any) => {
            const tasks = original.runs as RawTaskRun[];

            return tasks.map((task) => ({
                ...task,
                startedAt: new Date(task.startedAt),
                completedAt: new Date(task.completedAt),
            }));
        });
    };

    get = async (id: string): Promise<TaskRun> => {
        return this.client.get(`/tasks/${id}`, (original: RawTaskRun) => {
            return {
                ...original,
                startedAt: new Date(original.startedAt),
                completedAt: new Date(original.completedAt),
            };
        });
    };
}
