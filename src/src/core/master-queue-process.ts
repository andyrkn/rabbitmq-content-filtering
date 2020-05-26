import amqplib from 'amqplib';
import { publishToQueues } from './default-process';

export async function processFromMaster(channel: amqplib.Channel, queues: string[]): Promise<void> {
    const sub_queues = queues.filter(x => x != "master");

    await channel.consume('master', (message: amqplib.ConsumeMessage | null) => {

        if (message === null) {
            return;
        }

        publishToQueues(channel, channel, sub_queues, message)
    });
}