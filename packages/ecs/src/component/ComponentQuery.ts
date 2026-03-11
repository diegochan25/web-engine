import type { World } from "@/world";
import { SparseSet } from "@common/class";
import type { Component } from "./Component";
import type { Entity } from "@entity";

export class ComponentQuery<C extends Component[] = Component[]> {
    private readonly _world: World;
    private readonly _stores: SparseSet<Component>[];
    private readonly _primary: SparseSet<Component>;

    static empty(world: World): ComponentQuery<any[]> {
        return new ComponentQuery(world, [new SparseSet()]);
    }

    constructor(world: World, stores: SparseSet<Component>[]) {
        this._world = world;
        this._stores = stores;

        if (stores.length === 0) {
            throw new Error("ComponentQuery requires at least one component");
        }

        let primary = stores[0];

        for (const store of stores) {
            if (store.size < primary.size) {
                primary = store;
            }
        }

        this._primary = primary;
    }

    private _valid(id: number): boolean {
        for (const store of this._stores) {
            if (store === this._primary) continue;

            if (!store.has(id)) {
                return false;
            }
        }

        return true;
    }

    count(): number {
        let count = 0;

        for (const id of this._primary.keys()) {
            if (this._valid(id)) {
                count++;
            }
        }

        return count;
    }

    *entities(): IterableIterator<Entity> {
        for (const id of this._primary.keys()) {
            if (!this._valid(id)) continue;

            yield this._world.entities.get(id);
        }
    }

    *items(): IterableIterator<[Entity, ...C]> {
        for (const id of this._primary.keys()) {
            if (!this._valid(id)) continue;

            const entity = this._world.entities.get(id);

            const components = this._stores.map(
                store => store.get(id)
            ) as C;

            yield [entity, ...components];
        }
    }

    forEach(callback: (entity: Entity, ...components: C) => void): void {
        for (const id of this._primary.keys()) {
            if (!this._valid(id)) continue;

            const entity = this._world.entities.get(id);

            const components = this._stores.map(
                store => store.get(id)
            ) as C;

            callback(entity, ...components);
        }
    }

    [Symbol.iterator]() {
        return this.items();
    }
}