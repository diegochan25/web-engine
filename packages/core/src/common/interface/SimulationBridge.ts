export interface SimulationBridge {
    start(): void;
    step(deltatime: number): void;
    stop(): void;
}