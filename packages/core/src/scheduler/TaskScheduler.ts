import type { SupportsFixedUpdate, SupportsLateUpdate, SupportsUpdate, Task } from "./Task";
import { DistinctArray } from "@common/class";
import type { TaskContext } from "./TaskContext";

export class TaskScheduler {
    private readonly _context: TaskContext;
    private readonly _updateTasks = new DistinctArray<SupportsUpdate>();
    private readonly _lateUpdateTasks = new DistinctArray<SupportsLateUpdate>();
    private readonly _fixedUpdateTasks = new DistinctArray<SupportsFixedUpdate>();

    constructor(context: TaskContext) {
        this._context = context;
    }

    public add(task: Task): void {
        task.inject(this._context);
        if (task.onUpdate) this._updateTasks.add(task as SupportsUpdate);
        if (task.onLateUpdate) this._lateUpdateTasks.add(task as SupportsLateUpdate);
        if (task.onFixedUpdate) this._fixedUpdateTasks.add(task as SupportsFixedUpdate);
    }

    public update(): void {
        for (let i = 0, len = this._updateTasks.length; i < len; i++) {
            this._updateTasks[i].onUpdate();
        }
    }

    public lateUpdate(): void {
        for (let i = 0, len = this._lateUpdateTasks.length; i < len; i++) {
            this._lateUpdateTasks[i].onLateUpdate();
        }
    }

    public fixedUpdate(): void {
        for (let i = 0, len = this._fixedUpdateTasks.length; i < len; i++) {
            this._fixedUpdateTasks[i].onFixedUpdate();
        }
    }
}
