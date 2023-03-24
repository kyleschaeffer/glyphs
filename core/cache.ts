export class LRUCache<T> {
  private _entries = new Map<string | number, T>()

  constructor(private _size: number = 10) {}

  public get(key: string | number): T | undefined {
    const value = this._entries.get(key)
    if (value !== undefined) {
      this._entries.delete(key)
      this._entries.set(key, value)
    }
    return value
  }

  public set(key: string | number, value: T): void {
    if (this._entries.size >= this._size) this._entries.delete(this._entries.keys().next().value)
    this._entries.set(key, value)
  }
}
