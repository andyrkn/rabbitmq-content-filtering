import amqplib from "amqplib";
import { pubStringtoPub, subStringToISub } from "../model-converter";
import { IMessage, IPubField, ISubField } from "../models";
import { publicationMatchToSubscription } from ".";

export function publishToQueues(channelToSend: amqplib.Channel, channelToAck: amqplib.Channel, queues: string[], message: amqplib.ConsumeMessage): void {
    const publication: IMessage<IPubField> = pubStringtoPub(message.content.toString());

    let ack: boolean = false;
    queues.forEach((queueName: string) => {
        const queues: string[] = queueName.split('|');

        for (let i = 0; i < queues.length; i++) {
            const subscription: IMessage<ISubField> = subStringToISub(queues[i]);

            if (publicationMatchToSubscription(publication, subscription)) {
                channelToSend.sendToQueue(queueName, message.content);
                ack = true;
                break;
            }
        }
    });

    if(ack){
        channelToAck.ack(message);
    }
}