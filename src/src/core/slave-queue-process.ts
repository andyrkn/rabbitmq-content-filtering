import amqplib from 'amqplib';
import { IMessage, ISubField, IPubField } from '../models';
import { subStringToISub, pubStringtoPub } from '../model-converter';
import { publicationMatchToSubscription } from './matcher';

export async function connectToBroker(
    slaveChannel: amqplib.Channel,
    masterChannel: amqplib.Channel,
    queues: string[]): Promise<void> {

    const masterQueue = queues.join('|');
    await masterChannel.assertQueue(masterQueue, {
        autoDelete: false,
        durable: true,
        messageTtl: 60000,
    });

    masterChannel.consume(masterQueue, (message: amqplib.ConsumeMessage | null) => {
        if (message === null) {
            return;
        }

        const pub: IMessage<IPubField> = pubStringtoPub(message.content.toString());

        queues.forEach((queue: string) => {
            const sub: IMessage<ISubField> = subStringToISub(queue);
            if (publicationMatchToSubscription(pub, sub)) {
                slaveChannel.sendToQueue(queue, message.content);
                masterChannel.ack(message);
            }
        });
    });
}