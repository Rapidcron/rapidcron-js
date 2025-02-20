import type { Response } from "node-fetch";
import fetch from "node-fetch";
import { RapidcronAPIError, UnexpectedResponseError } from "./errors";
import { HTTPMethod } from "./types/requests";

type Transform<O, T> = (raw: O) => T;

type RapidcronError = {
    error: string;
};

export default class RapidcronClient {
    private readonly apiKey: string;

    constructor(options: { apiKey: string }) {
        this.apiKey = options.apiKey;
    }

    async get<O, T>(resource: string, transform?: Transform<O, T>): Promise<T> {
        return this.retryable<T>(async () => {
            const response = await this.makeRequest("GET", resource);
            return this.handleResponse(response, transform);
        });
    }

    async post<O, T>(resource: string, params?: object, transform?: Transform<O, T>): Promise<T> {
        return this.retryable<T>(async () => {
            const response = await this.makeRequest("POST", resource, params);
            return this.handleResponse(response, transform);
        });
    }

    async delete<O, T>(resource: string, transform?: Transform<O, T>): Promise<T> {
        return this.retryable(async () => {
            const response = await this.makeRequest("DELETE", resource);
            return this.handleResponse(response, transform);
        });
    }

    async retryable<T>(perform: () => Promise<T>, attempts = 5): Promise<T> {
        const attemptsLeft = attempts - 1;
        try {
            return await perform();
        } catch (e) {
            if (attemptsLeft > 0) {
                return this.retryable(perform, attemptsLeft);
            }

            throw e;
        }
    }

    async makeRequest(method: HTTPMethod, path: string, bodyObject?: object): Promise<Response> {
        const headers = {
            Authorization: `Bearer ${this.apiKey}`,
            ...(bodyObject ? { "Content-Type": "application/json" } : {}),
        };
        const body = bodyObject ? JSON.stringify(bodyObject) : undefined;

        return await fetch(`https://rapidcron.com/api/v1${path}`, {
            method,
            headers,
            body,
        });
    }

    async handleResponse<O, T>(
        response: Response,
        transform: (raw: O) => T = (raw) => raw as unknown as T
    ): Promise<T> {
        const { status } = response;
        const statusRange = Math.floor(status / 100);

        if (statusRange === 2) {
            if (status === 204) {
                return undefined as T;
            }

            return transform((await response.json()) as O);
        }

        if (statusRange === 4) {
            const body = (await response.json()) as RapidcronError;
            if (body.error) {
                throw new RapidcronAPIError(body.error);
            }

            throw new UnexpectedResponseError(status);
        }

        throw new UnexpectedResponseError(status);
    }
}
