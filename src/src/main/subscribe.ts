import amqplib from 'amqplib';
import cfg from './../../subscriber-config.json';
import { v4 as uuid } from 'uuid';
import { createQueue, SUBSCRIPTIONQUEUE } from '../core';
import { IQueueSubscription } from '../models';
import fs from 'fs';

export async function subscribeToBroker() {
    const conn = await amqplib.connect(cfg.url);
    const channel: amqplib.Channel = await conn.createChannel();

    const queueName: string = uuid();

    createQueue(channel, queueName);

    cfg.subscriptions.forEach((sub: string) => {

        const subscription: IQueueSubscription = {
            replyTo: queueName,
            subscription: sub
        };

        channel.sendToQueue(SUBSCRIPTIONQUEUE, Buffer.from(JSON.stringify(subscription)));
    });

    await channel.consume(queueName, async (message: amqplib.ConsumeMessage | null) => {
        if (!message) {
            return;
        };

        const date = new Date();

        const subscription = {
            pub: message.content.toString(),
            time: date,
        }

        const elemToAppend = `\"${JSON.stringify(subscription)}\"\n`;
        await fs.appendFile('subs.txt', elemToAppend, () => { });
        channel.ack(message);
    });
}
