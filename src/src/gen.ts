import { subStringToISub, pubStringtoPub } from './model-converter';
import { ISubField, IMessage, IPubField } from './models';

const subscriptionString: string = '{(car,=,Nissan);(speed,<=,50)}'

const publicationString: string = '{(car,Nissan),(speed,20),(city,Iasi)}'

function exec() {
    const x: IMessage<ISubField> = subStringToISub(subscriptionString);
    console.log(x);
}

function pub() {
    const x: IMessage<IPubField> = pubStringtoPub(publicationString)
    console.log(x);
}

exec();
pub();