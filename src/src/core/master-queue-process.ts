import amqplib from 'amqplib';
import { IMessage, IPubField, ISubField } from '../models';
import { pubStringtoPub, subStringToISub } from '../model-converter';
import { publicationMatchToSubscription } from './matcher';

export async function processFromMaster(channel: amqplib.Channel, queues: string[]): Promise<void> {
    const sub_queues = queues.filter(x => x != "master");

    await channel.consume('master', (message: amqplib.Message | null) => {
        const pubString = message?.content.toString();

        if (message === null) {
            return;
        }

        const publication: IMessage<IPubField> = pubStringtoPub(pubString);

        sub_queues.forEach((queueName: string) => {
            const queues: string[] = queueName.split('|');

            for (let i = 0; i < queues.length; i++) {
                const subscription: IMessage<ISubField> = subStringToISub(queues[i]);

                if (publicationMatchToSubscription(publication, subscription)) {
                    channel.sendToQueue(queueName, message.content);
                    channel.ack(message);
                    break;
                }
            }
        });
    });
}