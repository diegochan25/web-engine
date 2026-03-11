import { ComponentQueryManager } from "@/component/ComponentQueryManager";
import { ComponentRegistry } from "@component";
import { EntityManager } from "@entity";

export class World {
    private readonly _entities: EntityManager;
    private readonly _components: ComponentRegistry;
    private readonly _select: ComponentQueryManager;

    public get entities(): EntityManager {
        return this._entities;
    }

    public get components(): ComponentRegistry {
        return this._components;
    }

    public get select(): ComponentQueryManager {
        return this._select;
    }

    constructor() {
        this._entities = new EntityManager(this);
        this._components = new ComponentRegistry();
        this._select = new ComponentQueryManager(this);
    }
}