import ValtList from "./ValtList";

type MapProps = {
  value: string;
  ttl: number | null;
};

type ValtValue = string | ValtList | MapProps;

export class DB {
  storage = new Map<string, ValtValue>();

  set(
    key: string,
    value: string,
    ttlCommand: string | null = null,
    ttl: number | null = null,
  ) {
    const expiry = ttl === null ? null : Number(ttl);
    let time: number | null = null;
    if (ttlCommand === "EX" && expiry) {
      time = Date.now() + expiry * 1000;
    } else if (ttlCommand === "PX" && expiry) {
      time = Date.now() + expiry;
    }

    this.storage.set(key, { value, ttl: time });
  }

  get(key: string) {
    return this.storage.get(key);
  }

  delete(key: string) {
    this.storage.delete(key);
  }

  rpush(key: string, ...value: string[]): number {
    let list = this.storage.get(key);
    console.log("map", value);
    if (list === undefined) {
      list = new ValtList();
      this.storage.set(key, list);
    }

    if (!(list instanceof ValtList)) {
      throw new Error(
        "WRONGTYPE Operation against a key holding the wrong type of value",
      );
    }

    return list.rpush(...value);
  }

  lpush(key: string, ...value: string[]): number {
    let list = this.storage.get(key);

    if (list === undefined) {
      list = new ValtList();
      this.storage.set(key, list);
    }

    if (!(list instanceof ValtList)) {
      throw new Error(
        "WRONGTYPE Operation against a key holding the wrong type of valye",
      );
    }

    return list.lpush(...value);
  }
}
