export interface BaseFixture {}

export interface ReadOnlyFixture<T> extends BaseFixture {
    get value(): T
}

export class Fixture<T> implements ReadOnlyFixture<T> {
    get value(): T {
        if(this._value == undefined)
            throw new Error("Fixture used before being assigned")

        return this._value
    }

    set value(value: T) {
        this._value = value
    }

    private _value: T | undefined
}

export class Fixtures {
    public static get shared()
    {
        return this._instance || (this._instance = new this());
    }

    public getFixture<T>(key: string): Fixture<T> {
        if(!this._fixtures.has(key)) {
            this._fixtures.set(key, new Fixture<T>())
        }

        return this._fixtures.get(key) as Fixture<T>
    }

    public reset(): void {
        this._fixtures.clear()
    }

    private static _instance: Fixtures;

    private constructor()
    {

    }

    private readonly _fixtures = new Map<string, BaseFixture>()
}