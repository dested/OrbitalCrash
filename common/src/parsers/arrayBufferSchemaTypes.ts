export type Discriminate<T, TField extends keyof T, TValue extends T[TField]> = T extends {[field in TField]: TValue}
  ? T
  : never;
export type ABEnum<T extends string> = {[key in T]: number} & {flag: 'enum'};
export type ABBitmask<T> = {[keyT in keyof T]-?: number} & {flag: 'bitmask'};
export type ABArray<TElements> = {elements: TElements; flag: 'array-uint8' | 'array-uint16'};
export type ABTypeLookup = {flag: 'type-lookup'};
export type ABEntityTypeLookup = {flag: 'entity-type-lookup'};

export type AnyAndKey<TKey extends string, TValue> = {[key: string]: any} & {[key in TKey]: TValue};

export type ABScalars =
  | 'uint8'
  | 'uint16'
  | 'uint32'
  | 'int8'
  | 'int16'
  | 'int32'
  | 'float32'
  | 'float64'
  | 'int8Optional'
  | 'int32Optional'
  | 'string'
  | 'boolean';

export type ABFlags =
  | {flag: 'enum'}
  | {flag: 'bitmask'}
  | {elements: any; flag: 'array-uint8' | 'array-uint16'}
  | ({[key: string]: AnyAndKey<'type', number>} & {flag: 'type-lookup'; type: number})
  | ({[key: string]: AnyAndKey<'entityType', number>} & {entityType: number; flag: 'entity-type-lookup'})
  | {flag: undefined};

export type AB<T> = T extends string
  ? 'string' | ABEnum<T>
  : T extends number
  ?
      | 'uint8'
      | 'uint16'
      | 'uint32'
      | 'int8'
      | 'int16'
      | 'int32'
      | 'float32'
      | 'float64'
      | 'int8Optional'
      | 'int32Optional'
  : T extends boolean
  ? 'boolean'
  : T extends Array<any>
  ? T[number] extends {entityType: string}
    ? ABArray<ABSizeKeys<T[number]> & ABEntityTypeLookup>
    : T[number] extends {type: string}
    ? ABArray<ABKeys<T[number]> & ABTypeLookup>
    : ABArray<ABObj<T[number]>>
  : T extends {[key in keyof T]: boolean}
  ? ABBitmask<T>
  : T extends {type: string}
  ? ABKeys<T> & ABTypeLookup
  : T extends {entityType: string}
  ? ABSizeKeys<T> & ABEntityTypeLookup
  : T extends {}
  ? ABObj<T>
  : never;

export type ABObj<TItem> = {
  [keyT in keyof TItem]: AB<TItem[keyT]>;
};

export type ABByType<TItem extends {type: string}, TKey extends TItem['type']> = ABObj<
  Omit<Discriminate<TItem, 'type', TKey>, 'type'>
> & {type: number};

export type ABSizeByType<TItem extends {entityType: string}, TKey extends TItem['entityType']> = ABObj<
  Omit<Discriminate<TItem, 'entityType', TKey>, 'entityType'>
> & {entityType: number};

export type ABKeys<TItem extends {type: string}> = {
  [key in TItem['type']]: ABByType<TItem, key>;
};

export type ABSizeKeys<TItem extends {entityType: string}> = {
  [key in TItem['entityType']]: ABSizeByType<TItem, key>;
};