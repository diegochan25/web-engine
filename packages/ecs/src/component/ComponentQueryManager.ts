import type { Component } from "./Component";
import { ComponentQuery } from "./ComponentQuery";
import type { SparseSet } from "@common/class";
import type { World } from "@world";
import type { ComponentConstructor } from "./ComponentConstructor";

type ComponentTuple<T extends readonly ComponentConstructor<any>[]> =
    { [K in keyof T]: InstanceType<T[K]> } & Component[];

export class ComponentQueryManager {
    private readonly _world: World;

    constructor(world: World) {
        this._world = world;
    }

    where<T extends readonly ComponentConstructor<any>[]>(
        ...has: T
    ): ComponentQuery<ComponentTuple<T>> {

        const stores: SparseSet<Component>[] = [];

        for (const type of has) {
            const store = this._world.components.getStore(type);

            if (!store) {
                return ComponentQuery.empty(this._world) as ComponentQuery<ComponentTuple<T>>;
            }

            stores.push(store);
        }

        return new ComponentQuery(this._world, stores) as ComponentQuery<ComponentTuple<T>>;
    }
}