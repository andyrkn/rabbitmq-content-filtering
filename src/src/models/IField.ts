export type ISubField = IPubField & {
    op: string
}

export interface IPubField {
    name: string,
    value: string | number
}