export type Assign<T extends object, U extends object, I = Diff<T, U> & Intersection<U, T> & Diff<U, T>> = Pick<
  I,
  keyof I
>

export type Diff<T extends object, U extends object> = Pick<T, Exclude<keyof T, keyof U>>

export type DropFirst<T extends any[]> = T extends [any, ...rest: infer R] ? [...R] : T

export type ExcludeNever<T> = { [K in keyof T as T[K] extends never ? never : K]: T[K] }

export type ExcludeUndefined<T> = { [K in keyof T as T[K] extends undefined ? never : K]: T[K] }

export type IndexOf<A extends any[], T> = { [K in keyof A]: A[K] extends T ? K : never }[number]

export type Intersection<T extends object, U extends object> = Pick<
  T,
  Extract<keyof T, keyof U> & Extract<keyof U, keyof T>
>

export type OmitFirstArg<F> = F extends (first: any, ...rest: infer A) => infer R ? (...args: A) => R : never

export type Unsubscribe = () => void

export type Writable<T> = { -readonly [K in keyof T]: T[K] }
