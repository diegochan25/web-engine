import type { SupportsFixedUpdate, SupportsLateUpdate, SupportsUpdate, Task } from "./Task";
import { DistinctArray } from "../common/class/DistinctArray";
import type { TaskContext } from "./TaskContext";

export class TaskScheduler<T extends TaskContext = TaskContext> {
    private readonly _context: T;
    private _updateTasks = new DistinctArray<SupportsUpdate<T>>();
    private _lateUpdateTasks = new DistinctArray<SupportsLateUpdate<T>>();
    private _fixedUpdateTasks = new DistinctArray<SupportsFixedUpdate<T>>();
    
    constructor(context: T) {
        this._context = context;
    }

    public add(task: Task<T>): void {
        if (task.onUpdate) this._updateTasks.add(task as SupportsUpdate<T>);
        if (task.onLateUpdate) this._lateUpdateTasks.add(task as SupportsLateUpdate<T>);
        if (task.onFixedUpdate) this._fixedUpdateTasks.add(task as SupportsFixedUpdate<T>);
    }

    public update(): void {
        for (let i = 0, len = this._updateTasks.length; i < len; i++) {
            this._updateTasks[i].onUpdate(this._context);
        }
    }

    public lateUpdate(): void {
        for (let i = 0, len = this._lateUpdateTasks.length; i < len; i++) {
            this._lateUpdateTasks[i].onLateUpdate(this._context);
        }
    }

    public fixedUpdate(): void {
        for (let i = 0, len = this._fixedUpdateTasks.length; i < len; i++) {
            this._fixedUpdateTasks[i].onFixedUpdate(this._context);
        }
    }
}
