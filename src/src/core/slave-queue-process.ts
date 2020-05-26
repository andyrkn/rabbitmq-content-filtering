import amqplib from 'amqplib';
import { publishToQueues } from './default-process';

export async function connectToBroker(slaveChannel: amqplib.Channel, masterChannel: amqplib.Channel, queues: string[]): Promise<void> {

    const masterQueue = queues.join('|');
    
    await masterChannel.assertQueue(masterQueue, {
        autoDelete: false,
        durable: true,
        messageTtl: 60000,
    });

    await masterChannel.consume(masterQueue, (message: amqplib.ConsumeMessage | null) => {
        
        if (message === null) {
            return;
        }

        publishToQueues(slaveChannel, masterChannel, queues, message)
    });
}