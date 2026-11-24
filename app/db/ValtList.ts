export default class ValtList {
    private items: string[] = [];

    rpush(...value: string[]): number {
        console.log("list", value);
        this.items.push(...value);
        return this.items.length;
    }

    lpush(...value: string[]): number {
        this.items.unshift(...value);
        return this.items.length;
    }
}