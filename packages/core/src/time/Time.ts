export class Time {
    private _lastFrame: number = performance.now();

    private _scale: number = 1.0;
    private _maxDelta: number = 1_000 / 30;

    private _deltaTime: number = 0;
    private _smoothDeltaTime = 1_000 / 60;
    private _deltaTimeUnscaled: number = 0;

    private _elapsed: number = 0;
    private _elapsedUnscaled: number = 0;

    private _frameCount: number = 0;

    private _fixedDelta: number = 1_000 / 60;
    private _maxFixedSteps: number = 5;
    private _accumulator: number = 0;

    /**
     * Duration of a single fixed simulation step in **milliseconds**.
     *
     * Systems executed during {@link TaskScheduler.fixedUpdate} are expected
     * to advance their simulation by this amount of time per step.
     *
     * The default corresponds to **60 updates per second**.
     *
     * @readonly
     */
    public get fixedDelta(): number {
        return this._fixedDelta;
    }

    /**
     * Smoothed frame duration derived from {@link deltaTime}.
     *
     * This value is calculated using exponential smoothing, where each frame
     * gradually moves the stored value toward the current {@link deltaTime}.
     * This reduces short-term fluctuations in frame timing while still adapting
     * to longer-term performance changes.
     *
     * The smoothing process is updated once per frame during the engine's
     * time update step.
     *
     * @readonly
     */

    public get smoothDeltaTime(): number {
        return this._smoothDeltaTime;
    }

    /**
     * Maximum number of fixed simulation steps that may be processed
     * during a single frame.
     *
     * This acts as a safety mechanism to prevent the engine from spending
     * excessive time attempting to catch up when frames are delayed,
     * which can otherwise lead to the so-called *spiral of death*.
     *
     * @readonly
     */
    public get maxFixedSteps(): number {
        return this._maxFixedSteps;
    }

    /**
     * Interpolation factor between the previous and next fixed simulation step.
     *
     * The value is in the range `[0, 1)` and represents the proportion of
     * leftover time currently stored in the fixed-step accumulator.
     *
     * Rendering systems may use this value to interpolate between the
     * previous and current simulation states, producing smoother visuals
     * when the render rate differs from the fixed simulation rate.
     *
     * @readonly
     */
    public get alpha(): number {
        return this._accumulator / this._fixedDelta;
    }

    public set maxFixedSteps(value: number) {
        this._maxFixedSteps = value;
    }

    /**
     * Controls how quickly time progresses within the engine.
     *
     * A value greater than `1` speeds up time, while a value between `0`
     * and `1` slows it down. A value of `0` effectively pauses any logic
     * that depends on scaled time.
     *
     * This affects all scaled time measurements such as {@link deltaTime}
     * and {@link elapsed}.
     */
    public get scale(): number {
        return this._scale;
    }

    public set scale(value: number) {
        this._scale = value;
    }

    /**
     * Maximum allowed value for {@link deltaTime}.
     *
     * This acts as a safety clamp to prevent very large frame deltas
     * from destabilizing time-dependent systems (for example physics
     * or animation) when the browser stalls or the tab resumes after
     * being inactive.
     *
     * The default corresponds to roughly **30 FPS**.
     */
    public get maxDelta(): number {
        return this._maxDelta;
    }

    public set maxDelta(value: number) {
        this._maxDelta = value;
    }

    /**
     * The current rendering framerate expressed in frames per second (FPS).
     *
     * This value is calculated from the unscaled frame delta and represents
     * the instantaneous framerate of the most recently processed frame.
     *
     * @readonly
     */
    public get fps(): number {
        return 1_000 / this._deltaTimeUnscaled;
    }

    /**
     * Time in **milliseconds** between the current frame and the previous frame.
     *
     * This value is:
     *
     * - multiplied by {@link scale}
     * - clamped to {@link maxDelta}
     *
     * Most frame-based systems such as animation or movement should
     * use this value.
     *
     * @readonly
     */
    public get deltaTime(): number {
        return this._deltaTime;
    }

    /**
     * Raw time in **milliseconds** between the current frame and the previous frame.
     *
     * Unlike {@link deltaTime}, this value is **not affected** by:
     *
     * - {@link scale}
     * - {@link maxDelta}
     *
     * This is useful for systems that must operate on real time,
     * such as profiling, networking, or fixed-timestep simulation.
     *
     * @readonly
     */
    public get deltaTimeUnscaled(): number {
        return this._deltaTimeUnscaled;
    }

    /**
     * Total scaled time in **milliseconds** since the engine started.
     *
     * This value accumulates {@link deltaTime}, meaning it is affected
     * by {@link scale}.
     *
     * @readonly
     */
    public get elapsed(): number {
        return this._elapsed;
    }

    /**
     * Total real time in **milliseconds** since the engine started.
     *
     * Unlike {@link elapsed}, this value is **not affected** by
     * {@link scale}.
     *
     * @readonly
     */
    public get elapsedUnscaled(): number {
        return this._elapsedUnscaled;
    }

    /**
     * Number of frames processed since the engine started.
     *
     * This counter increases once per call to {@link update}.
     *
     * @readonly
     */
    public get frameCount(): number {
        return this._frameCount;
    }

    /**
     * Advances the engine's time state by processing a new frame.
     *
     * This method measures the elapsed real time since the previous frame
     * and updates all time-related values including:
     *
     * - {@link deltaTime}
     * - {@link deltaTimeUnscaled}
     * - {@link elapsed}
     * - {@link elapsedUnscaled}
     * - {@link frameCount}
     *
     * It should be called exactly once at the beginning of each engine frame.
     */
    public update(): void {
        const now = performance.now();
        this._frameCount++;
        this._deltaTimeUnscaled = now - this._lastFrame;
        this._deltaTime = Math.min(this._scale * this._deltaTimeUnscaled, this._maxDelta);
        this._smoothDeltaTime += (this._deltaTime - this._smoothDeltaTime) * 0.1;
        this._elapsed += this._deltaTime;
        this._elapsedUnscaled += this._deltaTimeUnscaled;
        this._accumulator += this._deltaTime;
        this._lastFrame = now;
    }

    /**
     * Calculates how many fixed simulation steps should be executed
     * during the current frame.
     *
     * The number of steps is derived from the accumulated frame time and
     * the configured {@link fixedDelta}. The result is clamped to
     * {@link maxFixedSteps} to prevent excessive catch-up work.
     *
     * Each call also consumes the corresponding amount of accumulated time.
     *
     * @returns The number of fixed simulation steps to perform this frame.
     */
    public getFixedSteps(): number {
        const steps = Math.min(Math.floor(this._accumulator / this._fixedDelta), this._maxFixedSteps);
        this._accumulator -= steps * this._fixedDelta;
        return steps;
    }
}