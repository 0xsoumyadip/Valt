type Entry = {
  value: string;
  expiry: number | null;
};

export const db = new Map<string, Entry>();

export function setData(
  key: string,
  value: string,
  ttlCommand: string | null = null,
  ttl: number | null = null,
) {
  let expiry: number | null = null;

  if (ttlCommand === "EX" && ttl) {
    expiry = Date.now() + ttl * 1000;
  } else if (ttlCommand === "PX" && ttl) {
    expiry = Date.now() + ttl;
  }
  db.set(key, { value, expiry });
}

export function getData(key: string) {
  const entry = db.get(key);
  if (!entry) return null;

  if (entry.expiry !== null && Date.now() >= entry.expiry) {
    db.delete(key);
    return null;
  }

  return entry.value;
}