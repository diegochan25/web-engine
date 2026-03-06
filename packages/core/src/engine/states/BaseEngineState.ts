import type { EngineStateKey } from "@enum/EngineStateKey";
import type { EngineStateContext } from "@engine/EngineStateContext";

export abstract class BaseEngineState {
    protected _context: EngineStateContext;

    constructor(context: EngineStateContext) {
        this._context = context;
    }

    public abstract get key(): EngineStateKey;
    public abstract get name(): string;
    public abstract get transitions(): Set<EngineStateKey>;
    public abstract onStateEnter(): Promise<void>;
    public abstract beforeStateUpdate?(from: EngineStateKey, to: EngineStateKey): void;
    public abstract onStateUpdate(frametime: number): void;
    public abstract afterStateUpdate?(from: EngineStateKey, to: EngineStateKey): void;
    public abstract onStateExit(): Promise<void>;
}