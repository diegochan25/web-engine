export interface InitMessage {
    type: "init",
    payload: {
        tickRate: number;
    }
}

export interface StartMessage {
    type: "start";
}

export interface StopMessage {
    type: "stop";
}

export type InputMessage<T = unknown> = {
  type: "input";
  payload: T;
};

export type ToWorkerMessage =
    | InitMessage
    | StartMessage
    | StopMessage
    | InputMessage;

   
export interface SnapshotMessage {
    type: "snapshot";
    payload: {
        tick: number;
    };
}

export type FromWorkerMessage =
    | SnapshotMessage;