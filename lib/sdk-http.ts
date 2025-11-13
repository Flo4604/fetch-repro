export type Fetcher = (
    input: RequestInfo | URL,
    init?: RequestInit,
) => Promise<Response>;

const DEFAULT_FETCHER: Fetcher = (input, init) => {
    if (init == null) {
        return fetch(input);
    } else {
        return fetch(input, init);
    }
};

export class HTTPClient {
    private fetcher: Fetcher;

    constructor(options?: { fetcher?: Fetcher }) {
        this.fetcher = options?.fetcher || DEFAULT_FETCHER;
    }

    createRequest(url: URL, options: RequestInit): Request {
        return new Request(url, options);
    }

    async request(request: Request): Promise<Response> {
        return await this.fetcher(request);
    }
}
