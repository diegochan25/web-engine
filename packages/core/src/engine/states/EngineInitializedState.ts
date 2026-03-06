import { EngineStateKey } from "@enum/EngineStateKey";
import { BaseEngineState } from "./BaseEngineState";

export class EngineInitializedState extends BaseEngineState {
    public get key(): EngineStateKey {
        return EngineStateKey.Initialized;
    }

    public get name(): string {
        return "EngineInitializedState";
    }

    public get transitions(): Set<EngineStateKey> {
        return new Set();
    }

    public async onStateEnter(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    public beforeStateUpdate?(from: EngineStateKey, to: EngineStateKey): void {
        throw new Error("Method not implemented.");
    }

    public onStateUpdate(frametime: number): void {
        throw new Error("Method not implemented.");
    }

    public afterStateUpdate?(from: EngineStateKey, to: EngineStateKey): void {
        throw new Error("Method not implemented.");
    }

    public async onStateExit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}