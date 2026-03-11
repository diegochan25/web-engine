export class SparseSet<T = any> {
    private readonly _capacity: number;
    private readonly _dense: Int32Array;
    private readonly _sparse: Int32Array;
    private readonly _values: T[];
    private _size: number = 0;

    constructor(capacity: number = 16) {
        this._capacity = capacity;
        this._dense = new Int32Array(capacity);
        this._sparse = new Int32Array(capacity).fill(-1);
        this._values = new Array(capacity);
    }

    private _tryGrow(key: number): void {
        if (key < this._capacity) return;

        let newCap = this._capacity;
        while (newCap <= key) newCap *= 2;

        const newDense = new Int32Array(newCap);
        newDense.set(this._dense);

        const newSparse = new Int32Array(newCap).fill(-1);
        newSparse.set(this._sparse);

        const newValues = new Array<T>(newCap);
        for (let i = 0; i < this._size; i++) {
            newValues[i] = this._values[i];
        }

        (this as any)._capacity = newCap;
        (this as any)._dense = newDense;
        (this as any)._sparse = newSparse;
        (this as any)._values = newValues;
    }

    private _assertKey(key: number): void {
        if (key < 0 || !Number.isInteger(key)) {
            throw new RangeError(`Key must be an integer between 0 and ${this._capacity - 1}`);
        }
    }

    public get size(): number {
        return this._size;
    }

    public get isEmpty(): boolean {
        return this._size === 0;
    }

    add(key: number, value?: T): this {
        this._tryGrow(key);
        this._assertKey(key);
        if (this.has(key)) return this;

        const idx = this._size;
        this._dense[idx] = key;
        this._sparse[key] = idx;
        this._values[idx] = value as T;
        this._size++;
        return this;
    }

    delete(key: number): boolean {
        this._assertKey(key);
        if (!this.has(key)) return false;

        const idx = this._sparse[key];
        const last = this._size - 1;

        if (idx !== last) {
            const lastKey = this._dense[last];
            this._dense[idx] = lastKey;
            this._values[idx] = this._values[last];
            this._sparse[lastKey] = idx;
        }

        this._sparse[key] = -1;
        this._values[last] = undefined as unknown as T;
        this._size--;
        return true;
    }

    public has(key: number): boolean {
        if (key < 0 || key >= this._capacity) return false;
        const index = this._sparse[key];
        return index >= 0 && index < this._size && this._dense[index] === key;
    }
 
    public get(key: number): T | undefined {
        if (key < 0 || key >= this._capacity) return undefined;

        const index = this._sparse[key];
        if (index >= this._size || this._dense[index] !== key) return undefined;

        return this._values[index];
    }

    public set(key: number, value: T): this {
        this._tryGrow(key);
        this._assertKey(key);

        const index = this._sparse[key];

        if (index >= 0 && index < this._size && this._dense[index] === key) {
            this._values[index] = value;
            return this;
        }

        return this.add(key, value);
    }

    clear(): void {
        for (let i = 0; i < this._size; i++) {
            this._sparse[this._dense[i]] = -1;
            this._values[i] = undefined as unknown as T;
        }
        this._size = 0;
    }

    *keys(): IterableIterator<number> {
        for (let i = 0; i < this._size; i++) {
            yield this._dense[i];
        }
    }

    *values(): IterableIterator<T> {
        for (let i = 0; i < this._size; i++) {
            yield this._values[i];
        }
    }

    *entries(): IterableIterator<[number, T]> {
        for (let i = 0; i < this._size; i++) {
            yield [this._dense[i], this._values[i]];
        }
    }

    forEach(callbackfn: (value: T, key: number, set: this) => void): void {
        for (let i = 0; i < this._size; i++) {
            callbackfn(this._values[i], this._dense[i], this);
        }
    }

    union(other: SparseSet<T>): SparseSet<T> {
        const cap = Math.max(this._capacity, other._capacity);
        const result = new SparseSet<T>(cap);
        for (const [k, v] of this) result.add(k, v);
        for (const [k, v] of other) result.set(k, v);
        return result;
    }

    difference(other: SparseSet<T>): SparseSet<T> {
        const result = new SparseSet<T>(this._capacity);
        for (let i = 0; i < this._size; i++) {
            const key = this._dense[i];
            if (!other.has(key)) result.add(key, this._values[i]);
        }
        return result;
    }

    intersection(other: SparseSet<T>): SparseSet<T> {
        const cap = Math.max(this._capacity, other._capacity);
        const result = new SparseSet<T>(cap);
        for (let i = 0; i < this._size; i++) {
            const key = this._dense[i];
            if (other.has(key)) result.add(key, this._values[i]);
        }
        return result;
    }

    *[Symbol.iterator](): Iterator<[number, T]> {
        for (let i = 0; i < this._size; i++) {
            yield [this._dense[i], this._values[i]];
        }
    }

    get [Symbol.toStringTag]() {
        return "SparseSet";
    }

    toString(): string {
        const pairs = [...this.entries()]
            .map(([k, v]) => (v === undefined ? `${k}` : `${k}:${JSON.stringify(v)}`))
            .join(", ");
        return `SparseSet(${this._size}/${this._capacity}) { ${pairs} }`;
    }
}