export class DistinctArray<T> extends Array<T> {
    constructor() {
        super();
        Object.setPrototypeOf(this, DistinctArray.prototype);
    }

    public override push(...items: T[]): number {
        for (const item of items) {
            if (!this.includes(item)) {
                super.push(item);
            }
        }
        return this.length;
    }


    public override unshift(...items: T[]): number {
        for (const item of items.reverse()) {
            if (!this.includes(item)) {
                super.unshift(item);
            }
        }
        return this.length;
    }

    public add(task: T): boolean {
        if (this.includes(task)) return false;
        super.push(task);
        return true;
    }

    public delete(task: T): boolean {
        const index = this.indexOf(task);
        if (index === -1) return false;

        this.splice(index, 1);
        return true;
    }

    public has(task: T): boolean {
        return this.includes(task);
    }

    public clear(): void {
        this.length = 0;
    }
}