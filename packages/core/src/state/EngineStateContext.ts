import { EngineState } from "./EngineState";

export class EngineStateContext {
    private _state: EngineState = EngineState.Boot;

    public get state(): EngineState {
        return this._state;
    }

    public transition(to: EngineState): void {
        if (this._state === to) return;
        this._state = to;
    }

    public canUpdate(): boolean {
        switch (this._state) {
            case EngineState.Running:
            case EngineState.Stepping:
                return true;
            default:
                return false;
        }
    }

    public canFixedUpdate(): boolean {
        return this._state === EngineState.Running;
    }

    public canLateUpdate(): boolean {
        switch (this._state) {
            case EngineState.Running:
            case EngineState.Stepping:
                return true;
            default:
                return false;
        }
    }

    public canRender(): boolean {
        switch (this._state) {
            case EngineState.Running:
            case EngineState.Paused:
            case EngineState.Stepping:
                return true;

            default:
                return false;
        }
    }

    public pause(): void {
        if (this._state === EngineState.Running) {
            this._state = EngineState.Paused;
        }
    }

    public resume(): void {
        if (this._state === EngineState.Paused) {
            this._state = EngineState.Running;
        }
    }

    public step(): void {
        this._state = EngineState.Stepping;
    }

    public shutdown(): void {
        this._state = EngineState.Disposing;
    }
}