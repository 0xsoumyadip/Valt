export default class RedisList<T> {
    private storage: T[] = [];

    rpush(value: T): number {
        this.storage.push(value);
        return this.storage.length;
    }

    lpush(value: T): number {
        this.storage.unshift(value);
        return this.storage.length;
    }
}