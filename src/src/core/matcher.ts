import { IMessage, IPubField, ISubField } from "../models";

export function publicationMatchToSubscription(pub: IMessage<IPubField>, sub: IMessage<ISubField>): boolean {
    if (sub.car) {
        if (pub.car) {
            if (!ops[sub.car.op](sub.car.value, pub.car.value))
                return false;
        }
    }
    if (sub.city) {
        if (pub.city) {
            if (!ops[sub.city.op](sub.city.value, pub.city.value))
                return false;
        }
    }
    if (sub.speed) {
        if (pub.speed) {
            if (!ops[sub.speed.op](Number(pub.speed.value), Number(sub.speed.value)))
                return false;
        }
    }
    if (sub.time) {
        if (pub.time) {
            if (!ops[sub.time.op](Number(pub.time.value), Number(sub.time.value)))
                return false;
        }
    }

    return true;
}

const ops: any = {
    '<=': (x: number, y: number) => x <= y ? true : false,
    '>=': (x: number, y: number) => x >= y ? true : false,
    '<': (x: number, y: number) => x < y ? true : false,
    '>': (x: number, y: number) => x > y ? true : false,
    '=': (x: string, y: string) => x === y ? true : false,
    '!=': (x: string, y: string) => x !== y ? true : false
}