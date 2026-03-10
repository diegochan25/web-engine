import type { TaskContext } from "@/scheduler/TaskContext";
import { EngineStateContext } from "@/state/EngineStateContext";
import { TaskScheduler } from "@scheduler";
import { Time } from "@time";

export class GameEngine {
    private readonly _time: Time;
    private readonly _context: EngineStateContext;
    private readonly _scheduler: TaskScheduler;
    private readonly _taskContext: TaskContext;
    private _running: boolean = false;

    public get time(): Time {
        return this._time;
    }

    public get context(): EngineStateContext {
        return this._context;
    }

    public get scheduler(): TaskScheduler {
        return this._scheduler;
    }

    constructor() {
        this._time = new Time();
        this._context = new EngineStateContext();
        this._taskContext = Object.freeze({ time: this._time });
        this._scheduler = new TaskScheduler(this._taskContext);
    }

    private readonly _frame = (): void => {
        this._time.update();

        if (this._context.canFixedUpdate()) {
            const fixedSteps = this._time.getFixedSteps();
            for (let i = 0; i < fixedSteps; i++) {
                this._scheduler.fixedUpdate();
            }
        }

        if (this._context.canUpdate()) {
            this._scheduler.update();
        }
        if (this._context.canLateUpdate()) {
            this._scheduler.lateUpdate();
        }

        if (this._running) {
            requestAnimationFrame(this._frame);
        }
    };

    public start(): void {
        if (this._running) return;
        this._running = true;

        requestAnimationFrame(this._frame);
    }

    public stop(): void {
        this._running = false;
    }
}