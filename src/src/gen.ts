import { subStringToISub, pubStringtoPub } from './model-converter';
import { ISubField, IMessage, IPubField } from './models';
import { publicationMatchToSubscription } from './core/matcher';

const subscriptionString: string = '{(car,=,Nissan);(speed,<=,50)}'

const publicationString: string = '{(car,Nissan),(speed,20),(city,Iasi)}'

function exec() {
    const sub: IMessage<ISubField> = subStringToISub(subscriptionString);
    const pub: IMessage<IPubField> = pubStringtoPub(publicationString);


    const result = publicationMatchToSubscription(pub, sub)

    console.log(result);
}

exec();