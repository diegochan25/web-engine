import type { ToWorkerMessage, FromWorkerMessage } from "@common/types/protocol";

export class SimulationBridge {
    private readonly worker: Worker;

    constructor() {
        this.worker = new Worker(
            new URL("./simulation.worker.ts", import.meta.url),
            { type: "module" }
        );

        this.worker.onmessage = (event: MessageEvent<FromWorkerMessage>) => {
            this.handleMessage(event.data);
        };
    }

    private handleMessage(message: FromWorkerMessage) {
        switch (message.type) {
            case "snapshot":
                console.log("Received snapshot:", message.payload);
                break;
        }
    }

    private send(message: ToWorkerMessage) {
        this.worker.postMessage(message);
    }

    init(tickRate: number) {
        this.send({
            type: "init",
            payload: { tickRate }
        });
    }

    start() {
        this.send({ type: "start" });
    }

    stop() {
        this.send({ type: "stop" });
    }

    sendInput<T>(input: T) {
        this.send({
            type: "input",
            payload: input
        });
    }
}