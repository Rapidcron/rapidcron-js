class RapidcronError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class RapidcronAPIError extends RapidcronError {
    constructor(message: string) {
        super(message);
    }
}

export class UnexpectedResponseError extends RapidcronError {
    constructor(status: number) {
        super(`Unexpected response from Rapidcron, HTTP ${status}`);
    }
}
