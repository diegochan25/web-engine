import { SparseSet } from "@common/class";
import type { Component } from "./Component";
import type { ComponentConstructor } from "./ComponentConstructor";
import type { Entity } from "@entity";

export class ComponentRegistry {
    private readonly _stores = new Map<ComponentConstructor<any>, SparseSet<any>>();

    private _ensureStore<T extends Component>(
        type: ComponentConstructor<T>
    ): SparseSet<T> {
        let store = this._stores.get(type);

        if (!store) {
            store = new SparseSet<T>();
            this._stores.set(type, store);
        }

        return store;
    }

    getStore<T extends Component>(
        type: ComponentConstructor<T>
    ): SparseSet<T> | undefined {
        return this._stores.get(type);
    }

    add<T extends Component>(
        entity: Entity,
        type: ComponentConstructor<T>,
        component: T
    ): void {
        this._ensureStore(type).set(entity.id, component);
    }

    get<T extends Component>(
        entity: Entity,
        type: ComponentConstructor<T>
    ): T | undefined {
        return this._stores.get(type)?.get(entity.id);
    }

    has<T extends Component>(
        entity: Entity,
        type: ComponentConstructor<T>
    ): boolean {
        return this._stores.get(type)?.has(entity.id) ?? false;
    }

    remove<T extends Component>(
        entity: Entity,
        type: ComponentConstructor<T>
    ): boolean {
        return this._stores.get(type)?.delete(entity.id) ?? false;
    }

    removeAll(entity: Entity): void {
        for (const store of this._stores.values()) {
            store.delete(entity.id);
        }
    }

    stores(): IterableIterator<SparseSet<any>> {
        return this._stores.values();
    }
}