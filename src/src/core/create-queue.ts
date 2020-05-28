import amqpLib from 'amqplib';

export async function createQueue(channel: amqpLib.Channel, queueName: string): Promise<void> {
    await channel.assertQueue(queueName, {
        durable: true,
        autoDelete: true
    });
}