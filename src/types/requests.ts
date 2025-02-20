export type HTTPMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type BaseHttpRequest = {
    url: string;
    headers?: Record<string, string> | undefined;
};

type GetHTTPRequest = BaseHttpRequest & {
    method: "GET";
};

type OtherHTTPRequest = BaseHttpRequest & {
    method: "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

export type HTTPRequest = GetHTTPRequest | OtherHTTPRequest;
