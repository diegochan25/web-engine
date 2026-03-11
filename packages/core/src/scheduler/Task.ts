import type { Time } from "@time";
import type { TaskContext } from "./TaskContext";

export type SupportsUpdate = {
    onUpdate(): void;
}

export type SupportsLateUpdate = {
    onLateUpdate(): void;
}

export type SupportsFixedUpdate = {
    onFixedUpdate(): void;
}


export abstract class Task implements Partial<SupportsUpdate & SupportsLateUpdate & SupportsFixedUpdate> {
    protected context!: TaskContext;

    public inject(context: TaskContext) {
        this.context = context;
    }

    public get time(): Time {
        return this.context.time;
    }

    public onUpdate?(): void;
    public onLateUpdate?(): void;
    public onFixedUpdate?(): void;
}