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

    lrange(start: number, stop: number): string[] {
        const normalizeIndex = (index: number): number => index < 0 ? this.items.length + index : index;

        const from = normalizeIndex(start);
        const to = normalizeIndex(stop);

        if(from > this.items.length || to < 0) {
            return [];
        }

        const normalizedStart = Math.max(from, 0);
        const normalizedStop = Math.min(to, this.items.length - 1);

        if(normalizedStop < normalizedStart){
            return [];
        }

        return this.items.slice(normalizedStart, normalizedStop);
    }
}