import { ISubField, IPubField, IMessage } from "../models";

export function subStringToISub(sub: any): IMessage<ISubField> {
    const valuesArray: string[] = sub
        .replace(/(\()|(\))|(\})|(\{)/g, '')
        .replace(/(,)/g, ';')
        .split(';');

    const subscription: any = {};

    for (let i = 0; i < valuesArray.length; i += 3) {
        const field: ISubField = {
            name: valuesArray[i],
            op: valuesArray[i + 1],
            value: valuesArray[i + 2]
        }
        subscription[valuesArray[i]] = field;
    }

    return subscription as IMessage<ISubField>;
}

export function pubStringtoPub(pub: any): IMessage<IPubField> {
    const valuesArray: string[] = pub
        .replace(/(\()|(\))|(\})|(\{)/g, '')
        .replace(/(,)/g, ';')
        .split(';');

    const publication: any = {};

    for (let i = 0; i < valuesArray.length; i += 2) {
        const field: IPubField = {
            name: valuesArray[i],
            value: valuesArray[i + 1]
        }
        publication[valuesArray[i]] = field;
    }
    
    return publication as IMessage<IPubField>;
}