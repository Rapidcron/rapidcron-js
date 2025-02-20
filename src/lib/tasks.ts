import type RapidcronClient from "../rapidcron-client";
import { Task, TaskCreation } from "../types/tasks";

type RawTask = Omit<Task, "nextRunAt" | "createdAt"> & {
    nextRunAt: number | undefined;
    createdAt: number;
};

export default class Tasks {
    private client: RapidcronClient;

    constructor(client: RapidcronClient) {
        this.client = client;
    }

    create = async (creation: TaskCreation): Promise<Task> => {
        const transformed =
            creation.type === "delayed"
                ? {
                      ...creation,
                      nextRunAt: creation.nextRunAt.getTime(),
                  }
                : creation;

        return this.client.post(
            "/tasks",
            {
                ...transformed,
            },
            (original: RawTask) => {
                return {
                    ...original,
                    nextRunAt: original.nextRunAt ? new Date(original.nextRunAt) : undefined,
                    createdAt: new Date(original.createdAt),
                };
            }
        );
    };

    all = async (): Promise<Task[]> => {
        return this.client.get("/tasks", (original: any) => {
            const tasks = original.tasks as RawTask[];

            return tasks.map((task) => ({
                ...task,
                nextRunAt: task.nextRunAt ? new Date(task.nextRunAt) : undefined,
                createdAt: new Date(task.createdAt),
            }));
        });
    };

    get = async (id: string): Promise<Task> => {
        return this.client.get(`/tasks/${id}`, (original: RawTask) => {
            return {
                ...original,
                nextRunAt: original.nextRunAt ? new Date(original.nextRunAt) : undefined,
                createdAt: new Date(original.createdAt),
            };
        });
    };

    cancel = async (id: string): Promise<void> => {
        await this.client.post(`/tasks/${id}/cancel`);
    };

    resume = async (id: string): Promise<void> => {
        await this.client.post(`/tasks/${id}/resume`);
    };
}
