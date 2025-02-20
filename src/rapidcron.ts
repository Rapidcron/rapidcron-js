import Runs from "./lib/runs";
import Tasks from "./lib/tasks";
import RapidcronClient from "./rapidcron-client";

export default class Rapidcron {
    private readonly client: RapidcronClient;
    tasks: Tasks;
    runs: Runs;

    constructor(apiKey: string) {
        this.client = new RapidcronClient({ apiKey });

        this.tasks = new Tasks(this.client);
        this.runs = new Runs(this.client);
    }
}
