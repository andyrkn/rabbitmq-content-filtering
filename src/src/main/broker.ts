import amqplib from 'amqplib';
import cfg from './../../broker-config.json';
import { queryQueues, processFromMaster, connectToBroker } from '../core';
/*
async function connect() {

    if (cfg.masterBroker) {
        await connectAsMaster();
    } else {
        await connectAsSlave();
    }

    // this will close the connections and the listeners
    // channel.close();
    // conn.close();
}
*/

export async function connectAsMaster() {
    const conn = await amqplib.connect(cfg.masterUrl);
    const channel: amqplib.Channel = await conn.createChannel();

    const queues = await queryQueues(cfg.masterQueues, cfg.masterUsername, cfg.masterPassword);

    await processFromMaster(channel, queues);
}

export async function connectAsSlave() {
    const masterConn = await amqplib.connect(cfg.masterUrl);
    const masterChannel: amqplib.Channel = await masterConn.createChannel();

    const slaveConn = await amqplib.connect(cfg.slaveUrl);
    const slaveChannel: amqplib.Channel = await slaveConn.createChannel();

    const queues = await queryQueues(cfg.slaveQueues, cfg.slaveUsername, cfg.slavePassword);

    connectToBroker(slaveChannel, masterChannel, queues);
}