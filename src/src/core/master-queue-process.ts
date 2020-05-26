import amqplib from 'amqplib';
import { IMessage, IPubField } from '../models';
import { pubStringtoPub } from '../model-converter';

export async function processFromMaster(channel: amqplib.Channel, queues: string[]): Promise<void> {
    const sub_queues = queues.filter(x => x != "master");

    await channel.consume('master', (message: amqplib.Message | null) => {
        const pubString = message?.content.toString();
        
        if (pubString !== undefined) {
            const publication: IMessage<IPubField> = pubStringtoPub(pubString);
            sub_queues.forEach((queue: string) => {
                
            });
        }
    })
}