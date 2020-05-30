import amqplib from 'amqplib';
import cfg from './../../publisher-config.json';

export async function publishToBroker() {
    const conn = await amqplib.connect(cfg.url);
    const channel: amqplib.Channel = await conn.createChannel();

    cfg.publications.forEach(async pub => {
        await channel.sendToQueue('master', new Buffer(pub));
    });
}