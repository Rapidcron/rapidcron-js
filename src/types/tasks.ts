import { HTTPRequest } from "./requests";

export type Task = {
    id: string;
    type: TaskType;
    status: TaskStatus;
    nextRunAt: Date | undefined;
    createdAt: Date;
    request: HTTPRequest;
};

export type TaskType = "delayed" | "recurring";

type BaseTaskCreation = {
    request: HTTPRequest;
};

type RecurringTaskCreation = BaseTaskCreation & {
    type: "recurring";
    recurrencePattern: string;
};

type DelayedTaskCreation = BaseTaskCreation & {
    type: "delayed";
    nextRunAt: Date;
};

export type TaskCreation = RecurringTaskCreation | DelayedTaskCreation;

export type TaskStatus = "created" | "queued" | "in_progress" | "failed" | "success" | "canceled";

export type TaskRun = {
    id: string;
    task: Task;
    success: boolean;
    responseBody: string;
    responseHeaders: string;
    responseCode: number;
    startedAt: Date;
    completedAt: Date;
};
