import { EngineStateKey } from "@/common/enum/EngineStateKey";
import { EngineStateContext } from "./EngineStateContext";
import { Time } from "./Time";
import { EventBus, type EngineEventMap } from "./EventBus";
import type { SimulationBridge } from "@interface/SimulationBridge";
import { WorkerSimulationBridge } from "./WorkerSimulationBridge";

export class GameEngine {
    private readonly _time: Time;
    private readonly _stateContext: EngineStateContext;
    private readonly _events: EventBus<EngineEventMap>;
    private readonly _simulation: SimulationBridge;
    private _running: boolean = false;
    private _lastFrame: number = 0;

    public get events(): EventBus<EngineEventMap> {
        return this._events;
    }

    constructor() {
        this._events = new EventBus();
        this._stateContext = new EngineStateContext(this);
        this._time = new Time(this._events);
        this._simulation = new WorkerSimulationBridge(new URL("./WebWorker.ts", import.meta.url));
    }

    private _tick = (): void => {
        if (!this._running) return;
        const now = performance.now();
        const deltatime = now - this._lastFrame;

        this._time.update(deltatime);
        this._stateContext.update(this._time.deltatime);

        this._lastFrame = now;
        requestAnimationFrame(this._tick);
    }

    public async start(): Promise<void> {
        if (this._running) return;
        await this._stateContext.transition(EngineStateKey.Started);
        this._running = true;
        this._lastFrame = performance.now();
        this.events.emit("engineStarted", undefined);
        requestAnimationFrame(this._tick);
    }

    public async stop(): Promise<void> {
        this._running = false;
        await this._stateContext.transition(EngineStateKey.Stopped);
        this.events.emit("engineStopped", undefined);
    }
}