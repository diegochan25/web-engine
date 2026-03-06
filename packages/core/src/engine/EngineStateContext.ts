import { EngineStateKey } from "@enum/EngineStateKey";
import type { BaseEngineState } from "./states/BaseEngineState";
import type { GameEngine } from "./GameEngine";
import { StateMachineError } from "@error/StateMachineError";
import { EngineInitializedState } from "./states/EngineInitializedState";
import { EngineRestState } from "./states/EngineRestState";
import { EngineRunningState } from "./states/EngineRunningState";
import { EngineStartedState } from "./states/EngineStartedState";
import { EngineStoppedState } from "./states/EngineStoppedState";
import { EngineDisposedState } from "./states/EngineDisposedState";
import type { EngineSubsystem } from "@/common/interface/EngineSubsystem";

export class EngineStateContext implements EngineSubsystem {
    private _current: EngineStateKey = EngineStateKey.Rest;
    private readonly _states: Map<EngineStateKey, BaseEngineState>;
    private _transitioning: boolean = false;
    public engine: GameEngine;

    constructor(engine: GameEngine) {
        this.engine = engine;
        this._states = new Map();
        this.register(new EngineRestState(this));
        this.register(new EngineInitializedState(this));
        this.register(new EngineStartedState(this));
        this.register(new EngineRunningState(this));
        this.register(new EngineStoppedState(this));
        this.register(new EngineDisposedState(this));
    }

    private register(state: BaseEngineState): void {
        this._states.set(state.key, state);
    }

    public get current(): EngineStateKey {
        return this._current;
    }

    public get state(): BaseEngineState {
        const state = this._states.get(this._current);
        if (!state)
            throw new StateMachineError("Current state is not registered.");
        return state;
    }

    public is(state: EngineStateKey): boolean {
        return this.current === state;
    }

    public async transition(to: EngineStateKey): Promise<void> {
        if (this._transitioning)
            throw new StateMachineError("State transition currently in progress.");

        const from = this._states.get(this._current) as BaseEngineState;
        const next = this._states.get(to);

        if (!next)
            throw new StateMachineError("Undefined target state '" + EngineStateKey[to] + "'.");
        if (!from.transitions.has(to))
            throw new StateMachineError("Illegal transition from '" + EngineStateKey[from.key] + "' to '" + EngineStateKey[to] + "'.");

        this._transitioning = true;

        try {
            await from.onStateExit();
            this._current = to;
            await next.onStateEnter();
            this.engine.events.emit("engineStateChanged", { from: from.key, to });
        } catch (error) {
            this._current = from.key;
            throw new StateMachineError("Transition to '" + EngineStateKey[to] + "' failed.", { cause: error });
        } finally {
            this._transitioning = false;
        }
    }

    public update(deltatime: number) {
        if (!this._transitioning) this.state.onStateUpdate(deltatime);
    }
}