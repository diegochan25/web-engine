import type { TaskContext } from "./TaskContext";

export type SupportsUpdate<T extends TaskContext = TaskContext> = {
    onUpdate: (context: T) => void;
}
export type SupportsLateUpdate<T extends TaskContext = TaskContext> = {
    onLateUpdate: (context: T) => void;
}
export type SupportsFixedUpdate<T extends TaskContext = TaskContext> = {
    onFixedUpdate: (context: T) => void;
}

export type Task<T extends TaskContext = TaskContext> = 
    Partial<
        SupportsUpdate<T> & 
        SupportsLateUpdate<T> & 
        SupportsFixedUpdate<T>
    >;