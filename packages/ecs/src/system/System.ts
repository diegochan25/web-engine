import type { ComponentQuery } from "@/component";
import { Task } from "@webengine/core";

export abstract class System extends Task {
    protected _query!: ComponentQuery;
    public abstract createQuery(): ComponentQuery;
    public onStart?(): void;
    public onUpdate?(): void;
    public onLateUpdate?(): void;
    public onFixedUpdate?(): void;
    public onDestroy?(): void;
}
