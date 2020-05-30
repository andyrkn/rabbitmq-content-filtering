import amqplib from 'amqplib';
import cfg from './../../publisher-config.json';
let fs = require('fs');

export async function publishToBroker() {
    const conn = await amqplib.connect(cfg.url);
    const channel: amqplib.Channel = await conn.createChannel();

    cfg.publications.forEach(async pub => {
        const date = new Date();
        
        const publication = {
            pub: pub.toString(),
            time: date,
        }

        const elemToAppend = "\"".concat(JSON.stringify(publication)).concat("\",\n");

        fs.appendFile('pubs.txt', JSON.stringify(elemToAppend));
        await channel.sendToQueue('master', new Buffer(pub));
    });
}