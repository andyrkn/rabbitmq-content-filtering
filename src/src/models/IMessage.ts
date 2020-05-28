import { ISubField, IPubField } from ".";

export interface IMessage<T extends ISubField | IPubField> {
    city?: T,
    car?: T,
    speed?: T,
    time?: T
}