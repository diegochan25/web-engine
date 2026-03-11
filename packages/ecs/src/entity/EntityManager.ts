import type { World } from "@world";
import { Entity } from "./Entity";

export class EntityManager {
    private _free: number[] = [];
    private _alive: boolean[] = [];
    private _next: number = 0;
    private readonly _world: World;

    constructor(world: World) {
        this._world = world;
    }

    private _hasId(id: number): boolean {
        return this._alive[id] === true;
    }

    create(): Entity {
        let id: number;

        if (this._free.length > 0) {
            id = this._free.pop()!;
        } else {
            id = this._next++;
        }

        this._alive[id] = true;

        return new Entity(this._world, id);
    }

    destroy(entity: Entity): void {
        const id = entity.id;

        if (!this._alive[id]) return;

        this._world.components.removeAll(entity);

        this._alive[id] = false;
        this._free.push(id);
    }

    has(entity: Entity): boolean {
        return this._hasId(entity.id);
    }

    get(id: number): Entity {
        if (!this._hasId(id)) {
            throw new Error(`Entity ${id} does not exist`);
        }

        return new Entity(this._world, id);
    }

    get count(): number {
        return this._next - this._free.length;
    }
}