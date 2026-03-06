export type Consumer<T> = (value: T) => void;
export type Mapper<T, U> = (value: T) => U;
export type Predicate<T> = (value: T) => boolean;
export type Provider<T> = () => T;