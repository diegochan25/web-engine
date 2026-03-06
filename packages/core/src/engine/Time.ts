import type { EngineSubsystem } from "@interface/EngineSubsystem";
import type { EngineEventMap, EventBus } from "./EventBus";

export class Time implements EngineSubsystem {
    private static readonly MAX_DELTATIME = 100;
    private _deltatime: number = 0;
    private _elapsed: number = 0;
    private _scale: number = 1.0;
    private readonly _events: EventBus<EngineEventMap>;

    constructor(events: EventBus<EngineEventMap>) {
        this._events = events;
    }

    public get deltatime(): number {
        return this._deltatime;
    }

    public get elapsed(): number {
        return this._elapsed;
    }

    public get scale(): number {
        return this._scale;
    }

    public set scale(value: number) {
        this._scale = value;
        this._events.emit("timeScaled", { scale: value });
    }

    public update(deltatime: number) {
        const scaledFrametime = Math.min(deltatime, Time.MAX_DELTATIME) * this.scale;
        this._deltatime = scaledFrametime;
        this._elapsed += scaledFrametime;
    }
}