import amqplib from 'amqplib';
import axios from 'axios';
import cfg from './../../broker-config.json';
import { processFromMaster } from '../core/master-queue-process';

async function connect() {

    const conn = await amqplib.connect(cfg.url);
    const channel: amqplib.Channel = await conn.createChannel();
    const queues_response = await axios.get(cfg.queuesEndpoint, {
        auth: { username: cfg.username, password: cfg.password }
    });
    const queues = queues_response.data.map((element: any) => element.name);

    await processFromMaster(channel, queues);

    //channel.sendToQueue(queues[0], new Buffer("1234"));

    // this will close the queue
    // channel.close();
    // conn.close();
}

connect();