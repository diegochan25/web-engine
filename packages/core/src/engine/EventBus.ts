import type { EngineStateKey } from "@enum/EngineStateKey";
import type { Consumer } from "@common/types";

type Listener<T> = Consumer<T>;

export type EngineEventMap = {
    "engineStarted": void;
    "engineStopped": void;
    "engineStateChanged": { from: EngineStateKey; to: EngineStateKey };
    "timeScaled": { scale: number };
};

export class EventBus<TEvents extends Record<string, any>> {
    private readonly _listeners = new Map<keyof TEvents, Set<Listener<any>>>();

    on<K extends keyof TEvents>(type: K, listener: Listener<TEvents[K]>): void {
        let set = this._listeners.get(type);
        if (!set) {
            set = new Set();
            this._listeners.set(type, set);
        }
        set.add(listener);
    }

    once<K extends keyof TEvents>(type: K, listener: Listener<TEvents[K]>): void {
        const wrapper: Listener<TEvents[K]> = (payload) => {
            this.off(type, wrapper);
            listener(payload);
        };
        this.on(type, wrapper);
    }

    off<K extends keyof TEvents>(type: K, listener: Listener<TEvents[K]>): void {
        this._listeners.get(type)?.delete(listener);
    }

    emit<K extends keyof TEvents>(type: K, payload: TEvents[K]): void {
        const listeners = this._listeners.get(type);
        if (!listeners) return;

        for (const listener of [...listeners]) {
            listener(payload);
        }
    }
}