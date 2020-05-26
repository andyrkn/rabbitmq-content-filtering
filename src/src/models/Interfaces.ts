export interface IMessage<T extends ISubField | IPubField> {
    city?: T,
    car?: T,
    speed?: T,
    time?: T
}

export type ISubField = IPubField & {
    op: string
}

export interface IPubField {
    name: string,
    value: string | number
}