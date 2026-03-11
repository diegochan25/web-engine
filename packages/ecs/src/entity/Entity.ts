import type { Component, ComponentConstructor } from "@component";
import type { World } from "@world";
export class Entity {
    private readonly _world: World;
    private _id: number;

    public get id(): number {
        return this._id;
    }

    constructor(world: World, id: number) {
        this._world = world;
        this._id = id;
    }

    public addComponent<T extends Component>(component: T): this {
        const type = component.constructor as ComponentConstructor<T>;
        this._world.components.add(this, type, component);
        return this;
    }
    public getComponent<T extends Component = Component>(type: ComponentConstructor<T>) {
        return this._world.components.get(this, type);
    }

    public removeComponent<T extends Component = Component>(type: ComponentConstructor<T>): boolean {
        return this._world.components.remove(this, type);
    }

    public hasComponent<T extends Component = Component>(type: ComponentConstructor<T>): boolean {
        return this._world.components.has(this, type);
    }

    public destroy(): void {
        this._world.entities.destroy(this);
    }

    isAlive(): boolean {
        return this._world.entities.has(this);
    }

    public toString(): string {
        return `Entity(${this._id})`;
    }
}